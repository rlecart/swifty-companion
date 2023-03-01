import db from '../db/db';

const apiEndpoint = 'https://api.intra.42.fr/v2';

const credentials = require('../../secrets/credentials.json');

const askNewAccessToken = async () => {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  };
  const params = {
    grant_type: 'client_credentials',
    client_id: credentials.client_id,
    client_secret: credentials.client_secret,
  };
  // console.log('ARRETEZ TOUT OUI')

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

const getAccessToken = async () => {
  try {
    let actualAccessToken = await db.getAccessToken();

    const now = Math.floor(new Date().getTime() / 1000);
    const tokenDateLimit = actualAccessToken?.created_at + actualAccessToken?.expires_in;

    if (actualAccessToken === undefined || actualAccessToken === null
      || actualAccessToken?.created_at === undefined || actualAccessToken?.created_at === null
      || actualAccessToken?.expires_in === undefined || actualAccessToken?.expires_in === null
      || tokenDateLimit < now) {
      const newAccessToken = await askNewAccessToken();
      await db.setAccessToken(newAccessToken);
      actualAccessToken = newAccessToken;
    }

    console.log('actualAccessToken: ', actualAccessToken?.access_token);
    return (actualAccessToken?.access_token);
  } catch (error) {
    console.log('error fetching access token: ', error);
    throw error;
  }
};

const getStudentByLogin = async (login, alreadyWaited) => {
  try {
    if (alreadyWaited !== true)
      await new Promise(resolve => setTimeout(resolve, 1000));

    const accessToken = await getAccessToken();
    console.log('token: ', accessToken);

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

const getStudentProjects = async (studentId, alreadyWaited) => {
  try {
    if (alreadyWaited !== true)
      await new Promise(resolve => setTimeout(resolve, 1000));

    const accessToken = await getAccessToken();
    console.log('token: ', accessToken);

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

      const timeLeft = 1000 - (timeSpend[0] + timeSpend[1]);
      if (timeSpend[0] !== 0 && timeSpend[1] !== 0 && timeLeft > 0) {
        timeSpend[0] = 0;
        timeSpend[1] = 0;
        await new Promise(resolve => setTimeout(resolve, timeLeft));
      }

      // await new Promise(resolve => setTimeout(resolve, 500));
    } while (lastResult?.length > 0);
    // console.log('allResults: ', allResults, allResults.length);

    return (allResults);

  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    throw error;
  }
};

const getStudentSkills = async (studentId, alreadyWaited) => {
  try {
    if (alreadyWaited !== true)
      await new Promise(resolve => setTimeout(resolve, 1000));

    const accessToken = await getAccessToken();
    console.log('token: ', accessToken);

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

    do {
      console.log('page: ', page);
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
            resolve(data?.[0]?.skills || []);
          };
        });

      })();
      page++;
      allResults = [...allResults, ...lastResult];

      const dateAfter = new Date();
      timeSpend[timeSpendIndex] = dateAfter - dateBefore;
      console.log('timeSpend: ', timeSpend);

      const timeLeft = 1000 - (timeSpend[0] + timeSpend[1]);
      console.log('timeLeft: ', timeLeft);
      if (timeSpend[0] !== 0 && timeSpend[1] !== 0 && timeLeft > 0) {
        timeSpend[0] = 0;
        timeSpend[1] = 0;
        await new Promise(resolve => setTimeout(resolve, timeLeft));
      }
      // await new Promise(resolve => setTimeout(resolve, 1000));

    } while (lastResult?.length > 0);

    return ({ level: level, skills: allResults });
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    throw error;
  }
};

const getStudentInfosByLogin = async (login) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const dateBefore = new Date();

    const studentBefore = new Date();
    const student = await getStudentByLogin(login, true);
    const studentAfter = new Date();
    await new Promise(resolve => setTimeout(resolve, 1000 - (studentAfter - studentBefore)));
    console.log('student: ', student);

    const projectsBefore = new Date();
    const projects = await getStudentProjects(student.id, true);
    const projectsAfter = new Date();
    await new Promise(resolve => setTimeout(resolve, 1000 - ((projectsAfter - projectsBefore) % 1000)));
    console.log('projects: ', projects);

    const skillsBefore = new Date();
    const skills = await getStudentSkills(student.id, true);
    const skillsAfter = new Date();
    await new Promise(resolve => setTimeout(resolve, 1000 - ((skillsAfter - skillsBefore) % 1000)));
    console.log('skills: ', skills);

    const dateAfter = new Date();
    console.log('time: ', dateAfter - dateBefore);

    // const projects = [];
    // const skills = { skills: [] };

    return ({ student, projects, skills });
  } catch (error) {
    console.error('There was a problem with the fetch operation (getStudentInfosByLogin):', error);
    throw error;
  }
};

export default {
  getStudentByLogin,
  getStudentProjects,
  getStudentSkills,
  getStudentInfosByLogin
};