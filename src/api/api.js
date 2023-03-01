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
        resolve(data);
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

const getStudentByLogin = async (login) => {
  try {
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
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status} ${response.statusText}}`);
    }

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

const getStudentProjects = async (studentId) => {
  try {
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

    const response = await fetch(`${apiEndpoint}/projects_users?` + new URLSearchParams(params) + `&filter[user_id]=${studentId}`, options);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status} ${response.statusText}}`);
    }

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
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    throw error;
  }
};

const getStudentSkills = async (studentId) => {
  try {
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

    const response = await fetch(`${apiEndpoint}/cursus_users?` + new URLSearchParams(params) + `&filter[user_id]=${studentId}`, options);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status} ${response.statusText}}`);
    }

    const blob = await response.blob();
    const reader = new FileReader();
    reader.readAsText(blob);
    return new Promise((resolve, reject) => {
      reader.onload = () => {
        const data = JSON.parse(reader.result);
        if (data === undefined || data === null || data.length <= 0)
          reject(new Error(`No skills array found with user_id ${studentId}`));
        resolve({
          skills: data?.[0]?.skills,
          level: data?.[0]?.level,
        });
      };
    });
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    throw error;
  }
};

const getStudentInfosByLogin = async (login) => {
  try {
    const student = await getStudentByLogin(login);
    // console.log('student: ', student);
    const projects = await getStudentProjects(student.id);
    // console.log('projects: ', projects);
    const skills = await getStudentSkills(student.id);
    // console.log('skills: ', skills);
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