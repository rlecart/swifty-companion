import { useIsFocused } from '@react-navigation/native';
import React, { Fragment, useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RenderIf from '../components/RenderIf';
import db from '../db/db';

import PendingClock from '../../assets/icons/pending-clock.png';

const StudentProfileScreen = ({ route, navigation, isLoaded }) => {
  const { student, projects, skills } = route.params;

  const isFocused = useIsFocused();

  const [language, setLanguage] = useState('fr');

  const [friendsList, setFriendsList] = useState(null);
  const [isFriend, setIsFriend] = useState(true);

  useEffect(() => {
    if (isLoaded) {
      getFriendsListFromDB();
      getLanguageFromDB();
    }
  }, [isLoaded, isFocused]);

  const getLanguageFromDB = async () => {
    try {
      const language = await db.getLanguage();
      setLanguage(language);
    } catch (error) {
      console.log('error fetching language: ', error);
    }
  };

  const getFriendsListFromDB = async () => {
    try {
      // const friends = await db.getFriendsList();
      const friends = [
        {
          type: 'friend',
          login: 'rlecart',
          image: 'https://cdn.intra.42.fr/users/c5f1f122c36f732a9a22af2531029ff6/rlecart.jpg',
        },
        {
          type: 'friend',
          login: 'valecart',
          image: 'https://cdn.intra.42.fr/users/9a6a60b928108deff03ed6f152bcd6ca/valecart.jpg',
        },
        {
          type: 'friend',
          login: 'cboudrin',
          image: 'https://cdn.intra.42.fr/users/b0cf67c26a1bbcc3824f50701f9ecb23/cboudrin.jpg',
        },
        // {
        //   type: 'friend',
        //   login: 'rlecart',
        //   image: 'https://cdn.intra.42.fr/users/c5f1f122c36f732a9a22af2531029ff6/rlecart.jpg',
        // },
        // {
        //   type: 'friend',
        //   login: 'valecart',
        //   image: 'https://cdn.intra.42.fr/users/9a6a60b928108deff03ed6f152bcd6ca/valecart.jpg',
        // },
        // {
        //   type: 'friend',
        //   login: 'cboudrin',
        //   image: 'https://cdn.intra.42.fr/users/b0cf67c26a1bbcc3824f50701f9ecb23/cboudrin.jpg',
        // },
        // {
        //   type: 'friend',
        //   login: 'rlecart',
        //   image: 'https://cdn.intra.42.fr/users/c5f1f122c36f732a9a22af2531029ff6/rlecart.jpg',
        // },
        // {
        //   type: 'friend',
        //   login: 'valecart',
        //   image: 'https://cdn.intra.42.fr/users/9a6a60b928108deff03ed6f152bcd6ca/valecart.jpg',
        // },
        // {
        //   type: 'friend',
        //   login: 'cboudrin',
        //   image: 'https://cdn.intra.42.fr/users/b0cf67c26a1bbcc3824f50701f9ecb23/cboudrin.jpg',
        // },
      ];
      setFriendsList(friends);
    } catch (error) {
      console.log('error fetching friendsList: ', error);
    }
  };

  const handleSetFriend = (nextIsFriend) => {
    setIsFriend(nextIsFriend);
  };

  console.log('student: ', student);
  console.log('projects: ', projects);
  console.log('skills: ', skills);

  return (
    <Fragment>
      <ScrollView style={style.container}>
        <View style={style.square} />

        <View style={style.headerContainer}>
          <View style={style.studentInfos}>
            <View style={style.studentImageContainer}>
              <Image
                style={style.studentImage}
                source={{ uri: student.image.link }}
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
                  language === 'en' && { width: 150 }
                ]}
                onPress={() => handleSetFriend(!isFriend)}
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
                  {Math.trunc((skills?.level - Math.trunc(skills?.level)) * 100) || '0'}%
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={style.bodyContainer}>
          <View style={style.categoryContainer}>

            <Text style={style.categoryTitle}>
              {language === 'fr' ? 'Informations' : 'Informations'}
            </Text>

            <View style={style.categoryContent}>

              <View style={style.categoryContentRow}>
                <Text style={style.categoryContentRowText}>
                  {student.phone}
                </Text>
              </View>

              <View style={style.categoryContentRow}>
                <Text style={style.categoryContentRowText}>
                  {student.email}
                </Text>
              </View>

            </View>
          </View>

          <View style={style.categoryContainer}>

            <Text style={style.categoryTitle}>
              {language === 'fr' ? 'Projets' : 'Projects'}
            </Text>

            <View style={style.categoryContent}>
              {projects.map((project, index) => {
                console.log('project: ', project);
                return (
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
                );
              })
              }
            </View>
          </View>

          <View style={style.categoryContainer}>
            <Text style={style.categoryTitle}>
              {language === 'fr' ? 'Compétences' : 'Skills'}
            </Text>

            <View style={style.categoryContent}>
              {skills.skills.map((skill, index) => (
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
          </View>

        </View>

      </ScrollView>
    </Fragment>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 30,
  },

  square: {
    position: 'absolute',
    top: -150, // -120
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
    // backgroundColor: '#1E1E1E',
    marginTop: 100,
    // padding: 20,
  },
  studentInfos: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  studentImageContainer: {
    // flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  studentImage: {
    width: 110,
    height: 110,
    borderRadius: '100%',
    // borderWidth: 2,
    // borderColor: '#F2F2F7',
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
    // height: '100%',
    // backgroundColor: 'red',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginLeft: 15,
    marginTop: 10,
  },
  studentName: {
    // backgroundColor: 'red',
    color: '#246B68',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  studentLogin: {
    // backgroundColor: 'red',
    color: '#246B68',
    fontSize: 16,
    fontWeight: 'light',
    textAlign: 'left',
    marginBottom: 5,
  },
  studentLocation: {
    // backgroundColor: 'red',
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
    // flex: 1,
    width: '100%',
    // flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginTop: 10,
    // backgroundColor: 'red',
  },
  level: {
    justifyContent: 'space-between',
    // backgroundColor: 'red',
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
    // position: 'absolute',
    // top: 22,
    // // left: 0,
    // // right: 0,
    // // width: '100%',
    // // height: '100%',
    width: 50,
    // height: 35,
    height: 55,
    // backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    // transform: [
    // { rotate: '18deg' },
    // { scaleX: 7 },
    // { scaleY: 3.4 },
    // ],
  },
  levelNumberSquare: {
    position: 'absolute',
    marginHorizontal: 'auto',
    top: 0,
    // left: 0,
    // right: 0,
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
    // borderBottomColor: 'red',
    borderBottomColor: '#FFE175',
    bottom: 0,
    position: 'absolute',
    transform: [
      { rotate: '180deg' },
    ],
  },
  levelNumber: {
    // height: '100%',
    // backgroundColor: 'red',
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
    // backgroundColor: '#1E1E1E',
    paddingBottom: 50,
    // padding: 20,
  },
  categoryContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    // backgroundColor: 'red',
    marginTop: 15,
    marginBottom: 10,
    // padding: 20,
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
    // backgroundColor: '#1E1E1E',
    // marginTop: 20,
    // padding: 20,
  },
  categoryContentRow: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // backgroundColor: '#1E1E1E',
    // marginVertical: 5,
    // padding: 20,
  },
  categoryContentRowText: {
    color: '#85858B',
    fontSize: 18,
    textAlign: 'left',
    marginVertical: 10,
    // backgroundColor: 'red',
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
    // backgroundColor: '#1E1E1E',
    marginTop: 10,
    marginBottom: 10,
    // padding: 20,
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
    // fontWeight: 'bold',
    textAlign: 'left',
  },
  skillPercentage: {
    color: '#5BA47A',
    fontSize: 16,
    // fontWeight: 'bold', 
    textAlign: 'right',
  },
  skillProgressBarContainer: {
    width: '100%',
    height: 12,
    backgroundColor: '#9BD1B2',
    borderRadius: '100%',
  },
  skillProgressBar: {
    // width: '100%',
    height: 12,
    backgroundColor: '#5BA47A',
    borderRadius: '100%',
  },

});

export default StudentProfileScreen;