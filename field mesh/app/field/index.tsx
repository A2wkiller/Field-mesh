import { router } from "expo-router";
import { 
  ClipboardList, 
  Users, 
  Droplets, 
  Package,
  LogOut,
  CheckCircle,
  AlertCircle,
  XCircle,
  Camera,
  ChevronDown,
  Image as ImageIcon,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  TextInput,
  StatusBar,
  Modal,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp } from "@/contexts/AppContext";
import { DisasterSurvey, AgricultureSurvey, AidDistribution, SyntheticDigiPin, DisasterType, LocationStatus } from "@/mocks/syntheticData";
import * as ImagePicker from 'expo-image-picker';

type SurveyType = 'disaster' | 'agriculture' | 'aid';

export default function FieldMeshScreen() {
  const { officer, logout, disasterSurveys, agricultureSurveys, aidDistributions, addDisasterSurvey, addAgricultureSurvey, addAidDistribution } = useApp();
  const [activeTab, setActiveTab] = useState<SurveyType>('disaster');

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

  return (
    <View style={styles.background}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>FIELD MESH</Text>
            <Text style={styles.headerSubtitle}>Survey & Data Collection</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color="#FF6B6B" />
          </TouchableOpacity>
        </View>

        {officer && (
          <View style={styles.officerCard}>
            <Users size={16} color="#4CAF50" />
            <View style={styles.officerInfo}>
              <Text style={styles.officerName}>{officer.name}</Text>
              <Text style={styles.officerRole}>{officer.role}</Text>
            </View>
            <View style={styles.offlineBadge}>
              <Text style={styles.offlineBadgeText}>OFFLINE</Text>
            </View>
          </View>
        )}

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'disaster' && styles.tabActive]}
            onPress={() => setActiveTab('disaster')}
          >
            <ClipboardList size={18} color={activeTab === 'disaster' ? '#0066CC' : '#8E9AAF'} />
            <Text style={[styles.tabText, activeTab === 'disaster' && styles.tabTextActive]}>
              Disaster
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'agriculture' && styles.tabActive]}
            onPress={() => setActiveTab('agriculture')}
          >
            <Droplets size={18} color={activeTab === 'agriculture' ? '#0066CC' : '#8E9AAF'} />
            <Text style={[styles.tabText, activeTab === 'agriculture' && styles.tabTextActive]}>
              Agriculture
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'aid' && styles.tabActive]}
            onPress={() => setActiveTab('aid')}
          >
            <Package size={18} color={activeTab === 'aid' ? '#0066CC' : '#8E9AAF'} />
            <Text style={[styles.tabText, activeTab === 'aid' && styles.tabTextActive]}>
              Aid
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {activeTab === 'disaster' && <DisasterSurveyForm onSubmit={addDisasterSurvey} officer={officer} />}
          {activeTab === 'agriculture' && <AgricultureSurveyForm onSubmit={addAgricultureSurvey} officer={officer} />}
          {activeTab === 'aid' && <AidDistributionForm onSubmit={addAidDistribution} officer={officer} />}

          <View style={styles.recordsSection}>
            <Text style={styles.sectionTitle}>SUBMITTED RECORDS</Text>
            {activeTab === 'disaster' && disasterSurveys.slice(-5).reverse().map((survey) => (
              <DisasterRecord key={survey.surveyId} survey={survey} />
            ))}
            {activeTab === 'agriculture' && agricultureSurveys.slice(-5).reverse().map((survey) => (
              <AgricultureRecord key={survey.surveyId} survey={survey} />
            ))}
            {activeTab === 'aid' && aidDistributions.slice(-5).reverse().map((aid) => (
              <AidRecord key={aid.aidId} aid={aid} />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function DisasterSurveyForm({ onSubmit, officer }: { onSubmit: (survey: DisasterSurvey) => void; officer: any }) {
  const [digiPin, setDigiPin] = useState<string>('');
  const [peopleAffected, setPeopleAffected] = useState('');
  const [injured, setInjured] = useState('');
  const [critical, setCritical] = useState('');
  const [dead, setDead] = useState('');
  const [trapped, setTrapped] = useState('');
  const [disasterType, setDisasterType] = useState<DisasterType>('Flood');
  const [areaCondition, setAreaCondition] = useState('');
  const [locationStatus, setLocationStatus] = useState<LocationStatus>('Field');
  const [photoEvidence, setPhotoEvidence] = useState<string | undefined>();
  const [showDisasterTypeModal, setShowDisasterTypeModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);

  const disasterTypes: DisasterType[] = ['Flood', 'Earthquake', 'Cyclone', 'Landslide', 'Fire', 'Building Collapse', 'Other'];
  const locationStatuses: LocationStatus[] = ['Field', 'Shelter', 'Hospital', 'Evacuated'];

  const calculateTrustScore = (): number => {
    const baseScore = 70;
    const heuristic = Math.random() * 15;
    const aiConsistency = Math.random() * 10;
    const peerConfirmation = Math.random() * 5;
    return Math.round(baseScore + heuristic + aiConsistency + peerConfirmation);
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Camera permission is required to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotoEvidence(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    const trustScore = calculateTrustScore();
    const survey: DisasterSurvey = {
      surveyId: `DS-${Date.now()}`,
      digiPin: digiPin as SyntheticDigiPin,
      peopleAffected: parseInt(peopleAffected) || 0,
      injured: parseInt(injured) || 0,
      critical: parseInt(critical) || 0,
      dead: parseInt(dead) || 0,
      trapped: parseInt(trapped) || 0,
      disasterType,
      areaCondition,
      locationStatus,
      photoEvidence,
      trustScore,
      trustStatus: trustScore >= 80 ? 'GREEN' : trustScore >= 60 ? 'ORANGE' : 'RED',
      timestamp: new Date().toISOString(),
      officerName: officer?.name,
    };
    onSubmit(survey);
    setDigiPin('');
    setPeopleAffected('');
    setInjured('');
    setCritical('');
    setDead('');
    setTrapped('');
    setDisasterType('Flood');
    setAreaCondition('');
    setLocationStatus('Field');
    setPhotoEvidence(undefined);
  };

  return (
    <View style={styles.form}>
      <Text style={styles.formTitle}>DISASTER SURVEY FORM</Text>
      <Text style={styles.label}>Synthetic DigiPin (DEMO)</Text>
      <TextInput
        style={styles.input}
        value={digiPin}
        onChangeText={setDigiPin}
        placeholder="e.g., DP-HACK-A1-001"
        placeholderTextColor="#666"
      />
      
      <Text style={styles.label}>Disaster Type</Text>
      <TouchableOpacity 
        style={styles.dropdown}
        onPress={() => setShowDisasterTypeModal(true)}
      >
        <Text style={styles.dropdownText}>{disasterType}</Text>
        <ChevronDown size={18} color="#8E9AAF" />
      </TouchableOpacity>

      <Text style={styles.label}>People Affected</Text>
      <TextInput
        style={styles.input}
        value={peopleAffected}
        onChangeText={setPeopleAffected}
        keyboardType="number-pad"
        placeholder="0"
        placeholderTextColor="#666"
      />
      <View style={styles.row}>
        <View style={styles.halfInput}>
          <Text style={styles.label}>Injured</Text>
          <TextInput
            style={styles.input}
            value={injured}
            onChangeText={setInjured}
            keyboardType="number-pad"
            placeholder="0"
            placeholderTextColor="#666"
          />
        </View>
        <View style={styles.halfInput}>
          <Text style={styles.label}>Critical</Text>
          <TextInput
            style={styles.input}
            value={critical}
            onChangeText={setCritical}
            keyboardType="number-pad"
            placeholder="0"
            placeholderTextColor="#666"
          />
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.halfInput}>
          <Text style={styles.label}>Dead</Text>
          <TextInput
            style={styles.input}
            value={dead}
            onChangeText={setDead}
            keyboardType="number-pad"
            placeholder="0"
            placeholderTextColor="#666"
          />
        </View>
        <View style={styles.halfInput}>
          <Text style={styles.label}>Trapped</Text>
          <TextInput
            style={styles.input}
            value={trapped}
            onChangeText={setTrapped}
            keyboardType="number-pad"
            placeholder="0"
            placeholderTextColor="#666"
          />
        </View>
      </View>
      
      <Text style={styles.label}>Current Location Status</Text>
      <TouchableOpacity 
        style={styles.dropdown}
        onPress={() => setShowLocationModal(true)}
      >
        <Text style={styles.dropdownText}>{locationStatus}</Text>
        <ChevronDown size={18} color="#8E9AAF" />
      </TouchableOpacity>

      <Text style={styles.label}>Area Condition</Text>
      <TextInput
        style={styles.input}
        value={areaCondition}
        onChangeText={setAreaCondition}
        placeholder="Describe the situation..."
        placeholderTextColor="#666"
        multiline
        numberOfLines={2}
      />

      <Text style={styles.label}>Photo Evidence</Text>
      <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
        <Camera size={20} color="#0066CC" />
        <Text style={styles.photoButtonText}>
          {photoEvidence ? 'Photo Captured ✓' : 'Take Photo'}
        </Text>
      </TouchableOpacity>
      {photoEvidence && (
        <View style={styles.photoPreview}>
          <Image source={{ uri: photoEvidence }} style={styles.photoImage} />
          <TouchableOpacity 
            style={styles.removePhoto}
            onPress={() => setPhotoEvidence(undefined)}
          >
            <Text style={styles.removePhotoText}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>SUBMIT SURVEY</Text>
      </TouchableOpacity>

      <Modal
        visible={showDisasterTypeModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDisasterTypeModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowDisasterTypeModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Disaster Type</Text>
            {disasterTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={styles.modalItem}
                onPress={() => {
                  setDisasterType(type);
                  setShowDisasterTypeModal(false);
                }}
              >
                <Text style={styles.modalItemText}>{type}</Text>
                {disasterType === type && <CheckCircle size={18} color="#4CAF50" />}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={showLocationModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLocationModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowLocationModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Location Status</Text>
            {locationStatuses.map((status) => (
              <TouchableOpacity
                key={status}
                style={styles.modalItem}
                onPress={() => {
                  setLocationStatus(status);
                  setShowLocationModal(false);
                }}
              >
                <Text style={styles.modalItemText}>{status}</Text>
                {locationStatus === status && <CheckCircle size={18} color="#4CAF50" />}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

function AgricultureSurveyForm({ onSubmit, officer }: { onSubmit: (survey: AgricultureSurvey) => void; officer: any }) {
  const [digiPin, setDigiPin] = useState('');
  const [crop, setCrop] = useState('');
  const [damageCause, setDamageCause] = useState('');
  const [damagePercent, setDamagePercent] = useState('');

  const calculateTrustScore = (): number => {
    return Math.round(60 + Math.random() * 40);
  };

  const handleSubmit = () => {
    const trustScore = calculateTrustScore();
    const survey: AgricultureSurvey = {
      surveyId: `AG-${Date.now()}`,
      digiPin: digiPin as SyntheticDigiPin,
      crop,
      damageCause,
      damagePercent: parseInt(damagePercent) || 0,
      trustScore,
      trustStatus: trustScore >= 80 ? 'GREEN' : trustScore >= 60 ? 'ORANGE' : 'RED',
      timestamp: new Date().toISOString(),
      officerName: officer?.name,
    };
    onSubmit(survey);
    setDigiPin('');
    setCrop('');
    setDamageCause('');
    setDamagePercent('');
  };

  return (
    <View style={styles.form}>
      <Text style={styles.formTitle}>AGRICULTURE SURVEY FORM</Text>
      <Text style={styles.label}>Synthetic DigiPin (DEMO)</Text>
      <TextInput
        style={styles.input}
        value={digiPin}
        onChangeText={setDigiPin}
        placeholder="e.g., DP-HACK-B2-011"
        placeholderTextColor="#666"
      />
      <Text style={styles.label}>Crop Type</Text>
      <TextInput
        style={styles.input}
        value={crop}
        onChangeText={setCrop}
        placeholder="e.g., Rice, Wheat"
        placeholderTextColor="#666"
      />
      <Text style={styles.label}>Damage Cause</Text>
      <TextInput
        style={styles.input}
        value={damageCause}
        onChangeText={setDamageCause}
        placeholder="e.g., Flood, Pest, Drought"
        placeholderTextColor="#666"
      />
      <Text style={styles.label}>Damage Percentage</Text>
      <TextInput
        style={styles.input}
        value={damagePercent}
        onChangeText={setDamagePercent}
        keyboardType="number-pad"
        placeholder="0-100"
        placeholderTextColor="#666"
      />
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>SUBMIT SURVEY</Text>
      </TouchableOpacity>
    </View>
  );
}

function AidDistributionForm({ onSubmit, officer }: { onSubmit: (aid: AidDistribution) => void; officer: any }) {
  const [digiPin, setDigiPin] = useState('');
  const [aidType, setAidType] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleSubmit = () => {
    const aid: AidDistribution = {
      aidId: `AID-${Date.now()}`,
      digiPin: digiPin as SyntheticDigiPin,
      aidType,
      quantity: parseInt(quantity) || 0,
      verified: Math.random() > 0.3,
      timestamp: new Date().toISOString(),
      officerName: officer?.name,
    };
    onSubmit(aid);
    setDigiPin('');
    setAidType('');
    setQuantity('');
  };

  return (
    <View style={styles.form}>
      <Text style={styles.formTitle}>AID DISTRIBUTION FORM</Text>
      <Text style={styles.label}>Synthetic DigiPin (DEMO)</Text>
      <TextInput
        style={styles.input}
        value={digiPin}
        onChangeText={setDigiPin}
        placeholder="e.g., DP-HACK-A1-001"
        placeholderTextColor="#666"
      />
      <Text style={styles.label}>Aid Type</Text>
      <TextInput
        style={styles.input}
        value={aidType}
        onChangeText={setAidType}
        placeholder="e.g., Food Pack, Medical Kit, Tents"
        placeholderTextColor="#666"
      />
      <Text style={styles.label}>Quantity</Text>
      <TextInput
        style={styles.input}
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="number-pad"
        placeholder="0"
        placeholderTextColor="#666"
      />
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>SUBMIT DISTRIBUTION</Text>
      </TouchableOpacity>
    </View>
  );
}

function DisasterRecord({ survey }: { survey: DisasterSurvey }) {
  const TrustIcon = survey.trustStatus === 'GREEN' ? CheckCircle : survey.trustStatus === 'ORANGE' ? AlertCircle : XCircle;
  const trustColor = survey.trustStatus === 'GREEN' ? '#4CAF50' : survey.trustStatus === 'ORANGE' ? '#FF9800' : '#FF3B30';

  return (
    <View style={styles.record}>
      <View style={styles.recordHeader}>
        <Text style={styles.recordId}>{survey.surveyId}</Text>
        <View style={styles.trustBadge}>
          <TrustIcon size={14} color={trustColor} />
          <Text style={[styles.trustScore, { color: trustColor }]}>{survey.trustScore}</Text>
        </View>
      </View>
      <Text style={styles.recordText}>Type: {survey.disasterType} | Location: {survey.locationStatus}</Text>
      <Text style={styles.recordText}>Affected: {survey.peopleAffected} | Critical: {survey.critical}</Text>
      {survey.photoEvidence && (
        <View style={styles.recordPhoto}>
          <ImageIcon size={12} color="#4CAF50" />
          <Text style={styles.recordPhotoText}>Photo Evidence Attached</Text>
        </View>
      )}
    </View>
  );
}

function AgricultureRecord({ survey }: { survey: AgricultureSurvey }) {
  const TrustIcon = survey.trustStatus === 'GREEN' ? CheckCircle : survey.trustStatus === 'ORANGE' ? AlertCircle : XCircle;
  const trustColor = survey.trustStatus === 'GREEN' ? '#4CAF50' : survey.trustStatus === 'ORANGE' ? '#FF9800' : '#FF3B30';

  return (
    <View style={styles.record}>
      <View style={styles.recordHeader}>
        <Text style={styles.recordId}>{survey.surveyId}</Text>
        <View style={styles.trustBadge}>
          <TrustIcon size={14} color={trustColor} />
          <Text style={[styles.trustScore, { color: trustColor }]}>{survey.trustScore}</Text>
        </View>
      </View>
      <Text style={styles.recordText}>DigiPin: {survey.digiPin}</Text>
      <Text style={styles.recordText}>Crop: {survey.crop} | Damage: {survey.damagePercent}%</Text>
      <Text style={styles.recordText}>Cause: {survey.damageCause}</Text>
    </View>
  );
}

function AidRecord({ aid }: { aid: AidDistribution }) {
  return (
    <View style={styles.record}>
      <View style={styles.recordHeader}>
        <Text style={styles.recordId}>{aid.aidId}</Text>
        <View style={[styles.verifiedBadge, !aid.verified && styles.unverifiedBadge]}>
          <Text style={styles.verifiedText}>{aid.verified ? 'VERIFIED' : 'PENDING'}</Text>
        </View>
      </View>
      <Text style={styles.recordText}>DigiPin: {aid.digiPin}</Text>
      <Text style={styles.recordText}>Type: {aid.aidType} | Qty: {aid.quantity}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#050B18",
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 102, 204, 0.2)",
    backgroundColor: "#0D1829",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 1.5,
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#8E9AAF",
    marginTop: 2,
  },
  logoutButton: {
    padding: 8,
  },
  officerCard: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    backgroundColor: "#0D1829",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(76, 175, 80, 0.3)",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  officerInfo: {
    flex: 1,
  },
  officerName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  officerRole: {
    fontSize: 12,
    color: "#8E9AAF",
    marginTop: 2,
  },
  offlineBadge: {
    backgroundColor: "#1B5E20",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  offlineBadgeText: {
    color: "#4CAF50",
    fontSize: 10,
    fontWeight: "700",
  },
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: "#152238",
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 6,
    gap: 6,
  },
  tabActive: {
    backgroundColor: "#0A1628",
  },
  tabText: {
    fontSize: 13,
    color: "#8E9AAF",
    fontWeight: "600",
  },
  tabTextActive: {
    color: "#0066CC",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  form: {
    backgroundColor: "#0D1829",
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(0, 102, 204, 0.2)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  formTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 16,
    letterSpacing: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#8E9AAF",
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: "#050B18",
    borderWidth: 1,
    borderColor: "rgba(0, 102, 204, 0.3)",
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    color: "#FFFFFF",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  submitButton: {
    backgroundColor: "#0066CC",
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
    alignItems: "center",
    shadowColor: "#0066CC",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  recordsSection: {
    marginTop: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#8E9AAF",
    marginBottom: 12,
    letterSpacing: 1,
  },
  record: {
    backgroundColor: "#0D1829",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(0, 102, 204, 0.2)",
  },
  recordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  recordId: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  trustBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#050B18",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  trustScore: {
    fontSize: 11,
    fontWeight: "700",
  },
  recordText: {
    fontSize: 12,
    color: "#C5D0E6",
    marginBottom: 2,
  },
  verifiedBadge: {
    backgroundColor: "#1B5E20",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  unverifiedBadge: {
    backgroundColor: "#5D4037",
  },
  verifiedText: {
    color: "#4CAF50",
    fontSize: 10,
    fontWeight: "700",
  },
  dropdown: {
    backgroundColor: "#050B18",
    borderWidth: 1,
    borderColor: "rgba(0, 102, 204, 0.3)",
    borderRadius: 10,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownText: {
    fontSize: 14,
    color: "#FFFFFF",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#0D1829",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    borderWidth: 1,
    borderColor: "rgba(0, 102, 204, 0.2)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  modalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#050B18",
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(0, 102, 204, 0.1)",
  },
  modalItemText: {
    fontSize: 14,
    color: "#FFFFFF",
  },
  photoButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#050B18",
    borderWidth: 2,
    borderColor: "#0066CC",
    borderRadius: 10,
    padding: 14,
    gap: 8,
  },
  photoButtonText: {
    fontSize: 14,
    color: "#0066CC",
    fontWeight: "600",
  },
  photoPreview: {
    marginTop: 12,
    position: "relative" as const,
    borderRadius: 8,
    overflow: "hidden",
  },
  photoImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  removePhoto: {
    position: "absolute" as const,
    top: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  removePhotoText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  recordPhoto: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  recordPhotoText: {
    fontSize: 11,
    color: "#4CAF50",
    fontWeight: "600",
  },
});
