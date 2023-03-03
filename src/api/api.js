import db from '../db/db';

import { CLIENT_ID, CLIENT_SECRET } from '@env';

const apiEndpoint = 'https://api.intra.42.fr/v2';

const credentials = {
  client_id: CLIENT_ID,
  client_secret: CLIENT_SECRET,
};

class Fetcher {
  constructor() {
    this.fetchList = [];
    this.isWorking = false;
  }

  get(type, param) {
    return new Promise((resolve, reject) => {
      this.fetchList.push({
        type,
        param,
        tries: 1,
        resolve,
        reject,
      });

      if (!this.isWorking) {
        this.isWorking = true;
        this.work();
      }
    });
  }

  async work() {
    while (this.fetchList.length > 0) {
      const { type, param, tries, resolve, reject } = this.fetchList.shift();

      await new Promise(resolve => setTimeout(resolve, 1200));

      try {
        const result = await this.fetch(type, param);
        resolve(result);
      } catch (error) {
        console.error('error fetching: ', error);
        if (tries > 10) {
          reject(error);
          continue;
        }
        this.fetchList.unshift({ type, tries: tries + 1, resolve, reject });
      }
    }

    this.isWorking = false;
  }

  async fetch(type, param) {
    switch (type) {
      case 'projects':
        return await this.getStudentProjects(param);
      case 'skills':
        return await this.getStudentSkills(param);
      case 'student':
        return await this.getStudentByLogin(param);
      default:
        throw new Error(`Unknown type: ${type}`);
    }
  }

  async getAccessToken() {
    try {
      let actualAccessToken = await db.getAccessToken();

      const now = Math.floor(new Date().getTime() / 1000);
      const tokenDateLimit = actualAccessToken?.created_at + actualAccessToken?.expires_in;

      if (actualAccessToken === undefined || actualAccessToken === null
        || actualAccessToken?.created_at === undefined || actualAccessToken?.created_at === null
        || actualAccessToken?.expires_in === undefined || actualAccessToken?.expires_in === null
        || tokenDateLimit - now < 0) {
        console.log('askNewAccessToken');
        const newAccessToken = await this.askNewAccessToken();
        await db.setAccessToken(newAccessToken);
        actualAccessToken = newAccessToken;
      }

      return (actualAccessToken?.access_token);
    } catch (error) {
      console.error('error fetching access token: ', error);
      throw error;
    }
  };

  async askNewAccessToken() {
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    };
    const params = {
      grant_type: 'client_credentials',
      client_id: credentials.client_id,
      client_secret: credentials.client_secret,
    };

    try {
      const response = await fetch(`${apiEndpoint}/oauth/token/?` + new URLSearchParams(params), options);
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status} ${response.statusText}}`);
      }

      const blob = await response.blob();
      const reader = new FileReader();
      reader.readAsText(blob);
      return new Promise(resolve => {
        reader.onload = () => {
          const data = JSON.parse(reader.result);
          if (data === undefined || data === null)
            reject(new Error(`Can't reach the access token`));
          setTimeout(() => resolve(data), 1000);
        };
      });
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  async getStudentByLogin(login) {
    try {
      console.log('getStudentByLogin: ', login);
      const accessToken = await this.getAccessToken();
      console.log('accessToken: ', accessToken);

      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + accessToken,
        }
      };
      const params = {
        client_id: credentials.client_id,
        client_secret: credentials.client_secret,
      };

      const response = await fetch(`${apiEndpoint}/users?` + new URLSearchParams(params) + `&filter[login]=${login}`, options);
      if (!response.ok)
        throw new Error(`Network response was not ok: ${response.status} ${response.statusText}}`);

      const blob = await response.blob();
      const reader = new FileReader();
      reader.readAsText(blob);
      return new Promise((resolve, reject) => {
        reader.onload = () => {
          const data = JSON.parse(reader.result);
          if (data === undefined || data === null || data.length !== 1)
            reject(new Error(`No user found with login ${login}`));
          resolve(data?.[0]);
        };
      });
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      throw error;
    }
  };

  async getStudentProjects(studentId) {
    try {
      const accessToken = await this.getAccessToken();

      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + accessToken,
        }
      };
      const params = {
        client_id: credentials.client_id,
        client_secret: credentials.client_secret,
      };

      let allResults = [];
      let lastResult = [];
      let page = 1;
      let timeSpend = [0, 0];

      do {
        const dateBefore = new Date();
        let timeSpendIndex = 0;

        lastResult = await (async () => {
          const response = await fetch(`${apiEndpoint}/projects_users?` + new URLSearchParams(params) + `&filter[user_id]=${studentId}&page=${page}&per_page=100`, options);
          if (!response.ok)
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}}`);

          timeSpendIndex = response.headers.get('x-secondly-ratelimit-remaining') % 2;

          const blob = await response.blob();
          const reader = new FileReader();
          reader.readAsText(blob);
          return new Promise((resolve, reject) => {
            reader.onload = () => {
              const data = JSON.parse(reader.result);
              if (data === undefined || data === null)
                reject(new Error(`No projects array found with user_id ${studentId}`));
              resolve(data);
            };
          });
        })();
        page++;
        allResults = [...allResults, ...lastResult];

        const dateAfter = new Date();

        timeSpend[timeSpendIndex] = dateAfter - dateBefore;

        const timeLeft = 1500 - (timeSpend[0] + timeSpend[1]);
        if (timeSpend[0] !== 0 && timeSpend[1] !== 0 && timeLeft > 0) {
          timeSpend[0] = 0;
          timeSpend[1] = 0;
          await new Promise(resolve => setTimeout(resolve, timeLeft));
        }

      } while (lastResult?.length > 0);

      return (allResults);

    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      throw error;
    }
  };


  async getStudentSkills(studentId) {
    try {
      const accessToken = await this.getAccessToken();

      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + accessToken,
        }
      };
      const params = {
        client_id: credentials.client_id,
        client_secret: credentials.client_secret,
      };

      let allResults = [];
      let lastResult = [];
      let page = 1;
      let timeSpend = [0, 0];

      let level = null;
      let cursusId = null;

      do {
        const dateBefore = new Date();
        let timeSpendIndex = 0;

        lastResult = await (async () => {
          const response = await fetch(`${apiEndpoint}/cursus_users?` + new URLSearchParams(params) + `&filter[user_id]=${studentId}&page=${page}&per_page=100`, options);
          if (!response.ok)
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}}`);

          timeSpendIndex = response.headers.get('x-secondly-ratelimit-remaining') % 2;

          const blob = await response.blob();
          const reader = new FileReader();
          reader.readAsText(blob);
          return new Promise((resolve, reject) => {
            reader.onload = () => {
              const data = JSON.parse(reader.result);
              if (data === undefined || data === null)
                reject(new Error(`No skills array found with user_id ${studentId}`));

              if (level === null)
                level = data?.[0]?.level;
              if (cursusId === null)
                cursusId = data?.[0]?.cursus_id;

              resolve(data?.[0]?.skills || []);
            };
          });

        })();
        page++;
        allResults = [...allResults, ...lastResult];

        const dateAfter = new Date();
        timeSpend[timeSpendIndex] = dateAfter - dateBefore;

        const timeLeft = 1500 - (timeSpend[0] + timeSpend[1]);
        if (timeSpend[0] !== 0 && timeSpend[1] !== 0 && timeLeft > 0) {
          timeSpend[0] = 0;
          timeSpend[1] = 0;
          await new Promise(resolve => setTimeout(resolve, timeLeft));
        }
      } while (lastResult?.length > 0);

      return ({
        level: level,
        skills: allResults,
        cursusId: cursusId,
      });
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      throw error;
    }
  };

}

const api = new Fetcher();

export default api;

// const getStudentInfosByLogin = async (login) => {
//   try {
//     await new Promise(resolve => setTimeout(resolve, 1500));

//     const studentBefore = new Date();
//     const student = await getStudentByLogin(login, true);
//     const studentAfter = new Date();
//     await new Promise(resolve => setTimeout(resolve, 1500 - (studentAfter - studentBefore)));

//     const projectsBefore = new Date();
//     const projects = await getStudentProjects(student.id, true);
//     const projectsAfter = new Date();
//     await new Promise(resolve => setTimeout(resolve, 1500 - ((projectsAfter - projectsBefore) % 1500)));

//     const skillsBefore = new Date();
//     const skills = await getStudentSkills(student.id, true);
//     const skillsAfter = new Date();
//     await new Promise(resolve => setTimeout(resolve, 1500 - ((skillsAfter - skillsBefore) % 1500)));

//     return ({ student, projects, skills });
//   } catch (error) {
//     console.error('There was a problem with the fetch operation (getStudentInfosByLogin):', error);
//     throw error;
//   }
// };

// export default {
//   getStudentByLogin,
//   getStudentProjects,
//   getStudentSkills,
//   getStudentInfosByLogin
// };