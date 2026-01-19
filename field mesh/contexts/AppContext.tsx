import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect } from 'react';
import {
  DisasterSurvey,
  AgricultureSurvey,
  AidDistribution,
  DISASTER_SURVEYS,
  AGRICULTURE_SURVEYS,
  AID_DISTRIBUTIONS,
} from '@/mocks/syntheticData';

interface Officer {
  deviceId: string;
  name: string;
  role: string;
}

export const [AppProvider, useApp] = createContextHook(() => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'FIELD' | 'HQ' | null>(null);
  const [officer, setOfficer] = useState<Officer | null>(null);
  const [disasterSurveys, setDisasterSurveys] = useState<DisasterSurvey[]>(DISASTER_SURVEYS);
  const [agricultureSurveys, setAgricultureSurveys] = useState<AgricultureSurvey[]>(AGRICULTURE_SURVEYS);
  const [aidDistributions, setAidDistributions] = useState<AidDistribution[]>(AID_DISTRIBUTIONS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      const [authData, officerData, disasterData, agData, aidData] = await Promise.all([
        AsyncStorage.getItem('auth'),
        AsyncStorage.getItem('officer'),
        AsyncStorage.getItem('disasterSurveys'),
        AsyncStorage.getItem('agricultureSurveys'),
        AsyncStorage.getItem('aidDistributions'),
      ]);

      if (authData) {
        const { isAuthenticated: auth, userRole: role } = JSON.parse(authData);
        setIsAuthenticated(auth);
        setUserRole(role);
      }

      if (officerData) {
        setOfficer(JSON.parse(officerData));
      }

      if (disasterData) {
        setDisasterSurveys(JSON.parse(disasterData));
      }

      if (agData) {
        setAgricultureSurveys(JSON.parse(agData));
      }

      if (aidData) {
        setAidDistributions(JSON.parse(aidData));
      }
    } catch (error) {
      console.error('Failed to load stored data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (pin: string, officerInfo?: { name: string; role: string }) => {
    let role: 'FIELD' | 'HQ' | null = null;

    if (pin === '112233') {
      role = 'FIELD';
    } else if (pin === '223344') {
      role = 'HQ';
    }

    if (role) {
      setIsAuthenticated(true);
      setUserRole(role);

      await AsyncStorage.setItem('auth', JSON.stringify({ isAuthenticated: true, userRole: role }));

      if (officerInfo && !officer) {
        const deviceId = `DEV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newOfficer = { deviceId, ...officerInfo };
        setOfficer(newOfficer);
        await AsyncStorage.setItem('officer', JSON.stringify(newOfficer));
      }

      return true;
    }

    return false;
  };

  const logout = async () => {
    setIsAuthenticated(false);
    setUserRole(null);
    await AsyncStorage.removeItem('auth');
  };

  const addDisasterSurvey = async (survey: DisasterSurvey) => {
    const updatedSurveys = [...disasterSurveys, survey];
    setDisasterSurveys(updatedSurveys);
    await AsyncStorage.setItem('disasterSurveys', JSON.stringify(updatedSurveys));
  };

  const addAgricultureSurvey = async (survey: AgricultureSurvey) => {
    const updatedSurveys = [...agricultureSurveys, survey];
    setAgricultureSurveys(updatedSurveys);
    await AsyncStorage.setItem('agricultureSurveys', JSON.stringify(updatedSurveys));
  };

  const addAidDistribution = async (aid: AidDistribution) => {
    const updatedAid = [...aidDistributions, aid];
    setAidDistributions(updatedAid);
    await AsyncStorage.setItem('aidDistributions', JSON.stringify(updatedAid));
  };

  return {
    isAuthenticated,
    userRole,
    officer,
    disasterSurveys,
    agricultureSurveys,
    aidDistributions,
    isLoading,
    login,
    logout,
    addDisasterSurvey,
    addAgricultureSurvey,
    addAidDistribution,
  };
});
