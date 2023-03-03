import React, { Fragment, useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

import PendingClock from '../../assets/icons/pending-clock.png';
import PhoneIcon from '../../assets/icons/phone.png';
import EmailIcon from '../../assets/icons/email.png';
import EasterHi from '../../assets/easter/easterHi.png';

import RenderIf from '../components/RenderIf';

import db from '../db/db';
import api from '../api/api';

const StudentProfileScreen = ({ route, navigation, isLoaded }) => {
  const { student } = route.params;

  const theme = useColorScheme();

  const isFocused = useIsFocused();

  const [language, setLanguage] = useState('fr');

  const [isFriend, setIsFriend] = useState(true);

  const [isFetching, setIsFetching] = useState(false);

  const [projects, setProjects] = useState(null);
  const [allProjects, setAllProjects] = useState(null);
  const [skills, setSkills] = useState(null);

  useEffect(() => {
    if (isLoaded) {
      getFriendsListFromDB();
      getLanguageFromDB();
      getSkillsFromAPI();
      getProjectsFromAPI();
    }
  }, [isLoaded, isFocused]);

  useEffect(() => {
    if (skills?.cursusId === undefined || skills?.cursusId === null)
      setAllProjects(projects);
    else
      setAllProjects(projects?.filter(p => p?.cursus_ids?.find(e => e === skills.cursusId)));
  }, [skills, projects]);

  const getProjectsFromAPI = async () => {
    try {
      const projects = await api.get('projects', student?.id);
      setProjects(projects);
    } catch (error) {
      console.error('error fetching projects: ', error);
    }
  };

  const getSkillsFromAPI = async () => {
    try {
      const skills = await api.get('skills', student?.id);
      setSkills(skills);
    } catch (error) {
      console.error('error fetching skills: ', error);
    }
  };

  const getLanguageFromDB = async () => {
    try {
      const language = await db.getLanguage();
      setLanguage(language);
    } catch (error) {
      console.error('error fetching language: ', error);
    }
  };

  const getFriendsListFromDB = async () => {
    setIsFetching(true);

    try {
      const friends = await db.getFriendsList();
      friends.some(friend => friend.login === student.login) ? setIsFriend(true) : setIsFriend(false);
    } catch (error) {
      console.error('error fetching friendsList: ', error);
    }

    setIsFetching(false);
  };

  const handleSetFriend = async (nextIsFriend) => {
    if (isFetching)
      return;

    setIsFetching(true);

    if (nextIsFriend === isFriend)
      throw new Error('nextIsFriend === isFriend');
    if (student === null || student === undefined)
      throw new Error('student is null or undefined');

    try {
      if (nextIsFriend)
        await db.addFriend(student);
      else
        await db.removeFriend(student);
      setIsFriend(nextIsFriend);
    } catch (error) {
      console.error(`error setting friend (${student?.login}): `, error);
    }

    setIsFetching(false);
  };

  return (
    <Fragment>
      <View style={[
        style.themeBackground,
        theme === 'dark' && { backgroundColor: '#171717' },
      ]}>
        <StatusBar style={theme === 'light' ? 'dark' : 'light'} />

        <View style={style.easterContainer}>
          <Image style={style.easter} source={EasterHi} />
        </View>

        <ScrollView style={style.container}>
          <View style={[
            style.backgroundContainer,
            theme === 'dark' && { backgroundColor: '#171717' },
          ]} />

          <View style={style.headerContainer}>
            <View style={style.square} />

            <View style={style.studentInfos}>
              <View style={style.studentImageContainer}>
                <Image
                  style={style.studentImage}
                  source={{ uri: student?.image?.link }}
                />
                <Text style={style.wallet}>
                  {student.wallet} W
                </Text>
              </View>

              <View style={style.studentInfosContainer}>
                <Text style={style.studentName}>
                  {student.displayname}
                </Text>
                <Text style={style.studentLogin}>
                  {student.login}
                </Text>
                <Text style={style.studentLocation}>
                  {student.location || '-'}
                </Text>

                <TouchableOpacity
                  style={[
                    style.addToFriendsButton,
                    isFriend && style.addToFriendsButtonActive,
                    language === 'en' && { width: 150 },
                    isFetching && { opacity: 0.5 },
                  ]}
                  onPress={() => handleSetFriend(!isFriend)}
                  disabled={isFetching}
                >
                  <Text style={[
                    style.addToFriendsButtonText,
                    isFriend && style.addToFriendsButtonTextActive,
                  ]}>
                    <RenderIf isTrue={!isFriend}>
                      {language === 'fr' ? '+ Ajouter aux amis' : '+ Add to friend'}
                    </RenderIf>

                    <RenderIf isTrue={isFriend}>
                      {language === 'fr' ? '- Retirer des amis' : '- Remove friend'}
                    </RenderIf>
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={style.levelContainer}>
              <View style={style.level}>
                <Text style={style.levelText}>
                  lvl
                </Text>
                <View style={style.levelNumberContainer}>
                  <View style={style.levelNumberSquare}>
                    <Text style={style.levelNumber}>
                      {Math.trunc(skills?.level) || '-'}
                    </Text>
                  </View>
                  <View style={style.levelNumberTriangle} />
                </View>
                <View style={style.levelPercentContainer}>
                  <Text style={style.levelPercent}>
                    {(skills && `${skills?.level * 1000}`.slice(-3).slice(0, 2)) || '0'}%
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={style.bodyContainer}>
            <View style={style.categoryContainer}>

              <Text style={[
                style.categoryTitle,
                theme === 'dark' && { color: 'white' }
              ]}>
                {language === 'fr' ? 'Informations' : 'Informations'}
              </Text>

              <View style={style.categoryContent}>

                <View style={[style.categoryContentRow, { justifyContent: 'flex-start' }]}>
                  <Image style={style.categoryContentRowIcon} source={PhoneIcon} resizeMode='contain' />
                  <Text style={style.categoryContentRowText}>
                    {student.phone}
                  </Text>
                </View>

                <View style={[style.categoryContentRow, { justifyContent: 'flex-start' }]}>
                  <Image style={style.categoryContentRowIcon} source={EmailIcon} resizeMode='contain' />
                  <Text style={style.categoryContentRowText}>
                    {student.email}
                  </Text>
                </View>

              </View>
            </View>

            <RenderIf isTrue={!projects || allProjects?.length > 0}>
              <View style={style.categoryContainer}>

                <Text style={[
                  style.categoryTitle,
                  theme === 'dark' && { color: 'white' }
                ]}>
                  {language === 'fr' ? 'Projets' : 'Projects'}
                </Text>

                <RenderIf isTrue={projects}>
                  <View style={style.categoryContent}>
                    {allProjects?.map((project, index) => (
                      <View key={index} style={style.categoryContentRow}>
                        <Text style={[
                          style.categoryContentRowText, {
                            maxWidth: '75%',
                            color: '#B6B6C1',
                          },
                          project.status === 'finished' && (project['validated?']
                            ? style.categoryContentRowTextValidated : style.categoryContentRowTextFailed),
                          project.status === 'in_progress' && style.categoryContentRowTextInProgress,
                        ]}
                          numberOfLines={1}
                        >
                          {project.project.name}
                        </Text>

                        <View style={[
                          style.projectEvaluation,
                          project.status === 'finished' && (project['validated?']
                            ? style.projectEvaluationValidated : style.projectEvaluationFailed),
                          project.status === 'in_progress' && style.projectEvaluationInProgress,
                        ]}>
                          <RenderIf isTrue={project.status !== 'in_progress'}>
                            <Text style={[
                              style.projectEvaluationText,
                              theme === 'dark' && { color: 'black' },
                              project.status === 'finished' && (project['validated?']
                                ? style.projectEvaluationTextValidated : style.projectEvaluationTextFailed),
                            ]}>
                              {project.final_mark || (project.status === 'finished' ? '0' : '-')}
                            </Text>
                          </RenderIf>

                          <RenderIf isTrue={project.status === 'in_progress'}>
                            <Image source={PendingClock} style={style.pendingClock} />
                          </RenderIf>
                        </View>
                      </View>
                    ))}
                  </View>
                </RenderIf>

                <RenderIf isTrue={!projects}>
                  <View style={[
                    style.categoryContent,
                    { justifyContent: 'center', alignItems: 'center', flex: 1, flexDirection: 'row' },
                  ]}>
                    <ActivityIndicator size="large" color="#B6B6C1" style={{ width: '100%' }} />
                  </View>
                </RenderIf>
              </View>
            </RenderIf>

            <RenderIf isTrue={!skills || skills.skills?.length > 0}>
              <View style={style.categoryContainer}>
                <Text style={[
                  style.categoryTitle,
                  theme === 'dark' && { color: 'white' }
                ]}>
                  {language === 'fr' ? 'Compétences' : 'Skills'}
                </Text>

                <RenderIf isTrue={skills}>
                  <View style={style.categoryContent}>
                    {skills?.skills?.map((skill, index) => (
                      <View key={index} style={style.categoryContentRow}>
                        <View style={style.skillContainer}>
                          <View style={style.skillHeaderContainer}>
                            <Text
                              style={[style.skillName, { maxWidth: '80%' }]}
                              numberOfLines={1}
                            >
                              {skill.name}
                            </Text>
                            <Text style={style.skillPercentage}>
                              {(skill.level / 20 * 100).toFixed(2)}%
                            </Text>
                          </View>

                          <View style={style.skillProgressBarContainer}>
                            <View style={[style.skillProgressBar, { width: `${skill.level / 20 * 100}%` }]} />
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                </RenderIf>

                <RenderIf isTrue={!skills}>
                  <View style={[
                    style.categoryContent,
                    { justifyContent: 'center', alignItems: 'center', flex: 1, flexDirection: 'row' },
                  ]}>
                    <ActivityIndicator size="large" color="#B6B6C1" style={{ width: '100%' }} />
                  </View>
                </RenderIf>
              </View>
            </RenderIf>

          </View>
        </ScrollView>

      </View >
    </Fragment >
  );
};

const style = StyleSheet.create({
  themeBackground: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F2F2F7',
  },

  easterContainer: {
    position: 'absolute',
    top: 100,
    left: 0,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    zIndex: -999,
  },
  easter: {
    width: 70,
    height: 70,
  },

  container: {
    flex: 1,
    paddingHorizontal: 30,
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '150%',
    backgroundColor: '#F2F2F7',
  },

  square: {
    position: 'absolute',
    bottom: 295,
    left: 0,
    width: 200,
    height: 200,
    backgroundColor: '#9BD1B2',
    transform: [
      { rotate: '18deg' },
      { scaleX: 7 },
      { scaleY: 3.4 },
    ],
  },

  headerContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop: 100,
  },
  studentInfos: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  studentImageContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  studentImage: {
    backgroundColor: '#246B68',
    width: 110,
    height: 110,
    borderRadius: '100%',
    marginBottom: 10,
  },
  wallet: {
    color: '#246B68',
    fontSize: 16,
    fontWeight: 'light',
    textAlign: 'center',
  },

  studentInfosContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginLeft: 15,
    marginTop: 10,
  },
  studentName: {
    color: '#246B68',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  studentLogin: {
    color: '#246B68',
    fontSize: 16,
    fontWeight: 'light',
    textAlign: 'left',
    marginBottom: 5,
  },
  studentLocation: {
    color: '#246B68',
    fontSize: 16,
    fontWeight: 'light',
    textAlign: 'left',
    marginBottom: 10,
  },

  addToFriendsButton: {
    backgroundColor: '#AFFFAD',
    borderRadius: '100%',
    paddingHorizontal: 15,
    paddingVertical: 10,
    width: 165,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToFriendsButtonActive: {
    backgroundColor: '#FFADAD',
  },
  addToFriendsButtonText: {
    color: '#42A43F',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  addToFriendsButtonTextActive: {
    color: '#A43F3F',
  },

  levelContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginTop: 10,
  },
  level: {
    justifyContent: 'space-between',
    width: 50,
    height: 100,
  },
  levelText: {
    color: '#246B68',
    fontSize: 15,
    fontWeight: 500,
    textAlign: 'center',
  },
  levelNumberContainer: {
    width: 50,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelNumberSquare: {
    position: 'absolute',
    marginHorizontal: 'auto',
    top: 0,
    width: '100%',
    height: 35,
    backgroundColor: '#FFE175',
    justifyContent: 'flex-end',
  },
  levelNumberTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 25,
    borderRightWidth: 25,
    borderBottomWidth: 20,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#FFE175',
    bottom: 0,
    position: 'absolute',
    transform: [
      { rotate: '180deg' },
    ],
  },
  levelNumber: {
    color: '#246B68',
    fontSize: 20,
    fontWeight: 800,
    textAlign: 'center',
  },
  levelPercentContainer: {
    alignItems: 'center',
  },
  levelPercent: {
    color: '#246B68',
    fontSize: 14,
    fontWeight: 300,
    textAlign: 'center',
  },

  bodyContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingBottom: 50,
  },
  categoryContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop: 15,
    marginBottom: 10,
  },
  categoryTitle: {
    color: 'black',
    fontSize: 35,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 10,
  },
  categoryContent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  categoryContentRow: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryContentRowIcon: {
    width: 20,
    height: 17,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    tintColor: '#9BD1B2',
  },
  categoryContentRowText: {
    color: '#85858B',
    fontSize: 18,
    textAlign: 'left',
    marginVertical: 10,
  },
  categoryContentRowTextValidated: {
    color: '#42A43F',
  },
  categoryContentRowTextFailed: {
    color: '#A43F3F',
  },
  categoryContentRowTextInProgress: {
    color: '#BDAF2E',
  },
  projectEvaluation: {
    width: 60,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D3D3DD',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: '10',
  },
  projectEvaluationValidated: {
    backgroundColor: '#AFFFAD',
  },
  projectEvaluationFailed: {
    backgroundColor: '#FFADAD',
  },
  projectEvaluationInProgress: {
    backgroundColor: '#FFEDAD',
  },
  projectEvaluationText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 300,
    textAlign: 'center',
  },
  projectEvaluationTextValidated: {
    color: '#42A43F',
  },
  projectEvaluationTextFailed: {
    color: '#A43F3F',
  },
  pendingClock: {
    width: 16,
    height: 16,
  },

  skillContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop: 10,
    marginBottom: 10,
  },
  skillHeaderContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 7,
  },
  skillName: {
    color: '#85858B',
    fontSize: 18,
    textAlign: 'left',
  },
  skillPercentage: {
    color: '#5BA47A',
    fontSize: 16,
    textAlign: 'right',
  },
  skillProgressBarContainer: {
    width: '100%',
    maxWidth: '100%',
    height: 12,
    backgroundColor: '#9BD1B2',
    borderRadius: '100%',
  },
  skillProgressBar: {
    maxWidth: '100%',
    height: 12,
    backgroundColor: '#5BA47A',
    borderRadius: '100%',
  },

});

export default StudentProfileScreen;