import { router } from "expo-router";
import { 
  Shield, 
  Users, 
  MapPin,
  Package,
  AlertTriangle,
  Activity,
  LogOut,
  CheckCircle,
  XCircle,
  TrendingUp,
  Building2,
  Home,
} from "lucide-react-native";
import React, { useState, useMemo } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  StatusBar,
  Dimensions,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { useApp } from "@/contexts/AppContext";

const { width } = Dimensions.get('window');

type DashboardTab = 'overview' | 'rescue' | 'hospital' | 'aid' | 'map';

export default function SmartFieldHQScreen() {
  const { officer, logout, disasterSurveys, agricultureSurveys, aidDistributions } = useApp();
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

  const stats = useMemo(() => {
    const totalAffected = disasterSurveys.reduce((sum, s) => sum + s.peopleAffected, 0);
    const totalInjured = disasterSurveys.reduce((sum, s) => sum + s.injured, 0);
    const totalCritical = disasterSurveys.reduce((sum, s) => sum + s.critical, 0);
    const totalDead = disasterSurveys.reduce((sum, s) => sum + s.dead, 0);
    const totalTrapped = disasterSurveys.reduce((sum, s) => sum + s.trapped, 0);
    const highTrust = disasterSurveys.filter(s => s.trustStatus === 'GREEN').length;
    const mediumTrust = disasterSurveys.filter(s => s.trustStatus === 'ORANGE').length;
    const lowTrust = disasterSurveys.filter(s => s.trustStatus === 'RED').length;
    const avgTrustScore = disasterSurveys.length > 0 
      ? Math.round(disasterSurveys.reduce((sum, s) => sum + s.trustScore, 0) / disasterSurveys.length)
      : 0;
    const verifiedAid = aidDistributions.filter(a => a.verified).length;

    const inField = disasterSurveys.reduce((sum, s) => s.locationStatus === 'Field' ? sum + s.peopleAffected : sum, 0);
    const inShelter = disasterSurveys.reduce((sum, s) => s.locationStatus === 'Shelter' ? sum + s.peopleAffected : sum, 0);
    const inHospital = disasterSurveys.reduce((sum, s) => s.locationStatus === 'Hospital' ? sum + s.peopleAffected : sum, 0);
    const evacuated = disasterSurveys.reduce((sum, s) => s.locationStatus === 'Evacuated' ? sum + s.peopleAffected : sum, 0);

    return { 
      totalAffected, 
      totalInjured,
      totalCritical, 
      totalDead, 
      totalTrapped,
      highTrust, 
      mediumTrust,
      lowTrust, 
      avgTrustScore,
      verifiedAid,
      inField,
      inShelter,
      inHospital,
      evacuated,
    };
  }, [disasterSurveys, aidDistributions]);

  const priorityQueue = useMemo(() => {
    return [...disasterSurveys]
      .sort((a, b) => {
        const priorityA = a.critical * 10 + a.trapped * 8 + a.injured * 2;
        const priorityB = b.critical * 10 + b.trapped * 8 + b.injured * 2;
        return priorityB - priorityA;
      })
      .slice(0, 10);
  }, [disasterSurveys]);

  return (
    <View style={styles.background}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <View>
            <View style={styles.headerTitleRow}>
              <Shield size={20} color="#FFFFFF" />
              <Text style={styles.headerTitle}>SMARTFIELD HQ</Text>
            </View>
            <Text style={styles.headerSubtitle}>Command & Intelligence Center</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color="#FF6B6B" />
          </TouchableOpacity>
        </View>

        {officer && (
          <View style={styles.officerCard}>
            <Users size={16} color="#0066CC" />
            <View style={styles.officerInfo}>
              <Text style={styles.officerName}>{officer.name}</Text>
              <Text style={styles.officerRole}>{officer.role}</Text>
            </View>
            <View style={styles.hqBadge}>
              <Text style={styles.hqBadgeText}>HQ ACCESS</Text>
            </View>
          </View>
        )}

        <View style={styles.tabContainer}>
          <TabButton icon={Activity} label="Overview" active={activeTab === 'overview'} onPress={() => setActiveTab('overview')} />
          <TabButton icon={AlertTriangle} label="Rescue" active={activeTab === 'rescue'} onPress={() => setActiveTab('rescue')} />
          <TabButton icon={MapPin} label="Map" active={activeTab === 'map'} onPress={() => setActiveTab('map')} />
          <TabButton icon={Package} label="Aid" active={activeTab === 'aid'} onPress={() => setActiveTab('aid')} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {activeTab === 'overview' && (
            <>
              <View style={styles.analyticsCard}>
                <View style={styles.analyticsHeader}>
                  <TrendingUp size={20} color="#0066CC" />
                  <Text style={styles.analyticsTitle}>OVERALL ANALYTICS</Text>
                </View>
                <View style={styles.analyticsGrid}>
                  <View style={styles.analyticsItem}>
                    <Text style={styles.analyticsValue}>{stats.avgTrustScore}</Text>
                    <Text style={styles.analyticsLabel}>Avg Trust Score</Text>
                  </View>
                  <View style={styles.analyticsItem}>
                    <Text style={styles.analyticsValue}>{disasterSurveys.length}</Text>
                    <Text style={styles.analyticsLabel}>Total Surveys</Text>
                  </View>
                  <View style={styles.analyticsItem}>
                    <Text style={styles.analyticsValue}>{stats.totalAffected}</Text>
                    <Text style={styles.analyticsLabel}>Total Affected</Text>
                  </View>
                  <View style={styles.analyticsItem}>
                    <Text style={styles.analyticsValue}>{stats.totalCritical}</Text>
                    <Text style={styles.analyticsLabel}>Critical Cases</Text>
                  </View>
                </View>
                <View style={styles.trustBreakdown}>
                  <View style={styles.trustItem}>
                    <View style={[styles.trustDot, { backgroundColor: '#4CAF50' }]} />
                    <Text style={styles.trustLabel}>High: {stats.highTrust}</Text>
                  </View>
                  <View style={styles.trustItem}>
                    <View style={[styles.trustDot, { backgroundColor: '#FF9800' }]} />
                    <Text style={styles.trustLabel}>Medium: {stats.mediumTrust}</Text>
                  </View>
                  <View style={styles.trustItem}>
                    <View style={[styles.trustDot, { backgroundColor: '#FF3B30' }]} />
                    <Text style={styles.trustLabel}>Low: {stats.lowTrust}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.locationCard}>
                <View style={styles.locationHeader}>
                  <MapPin size={20} color="#FF9800" />
                  <Text style={styles.locationTitle}>LOCATION STATUS OF AFFECTED PEOPLE</Text>
                </View>
                <View style={styles.locationGrid}>
                  <LocationStatCard 
                    icon={AlertTriangle} 
                    title="In Field" 
                    count={stats.inField} 
                    color="#FF3B30" 
                  />
                  <LocationStatCard 
                    icon={Home} 
                    title="In Shelter" 
                    count={stats.inShelter} 
                    color="#FF9800" 
                  />
                  <LocationStatCard 
                    icon={Building2} 
                    title="In Hospital" 
                    count={stats.inHospital} 
                    color="#2196F3" 
                  />
                  <LocationStatCard 
                    icon={CheckCircle} 
                    title="Evacuated" 
                    count={stats.evacuated} 
                    color="#4CAF50" 
                  />
                </View>
              </View>

              <View style={styles.statsGrid}>
                <StatCard title="PEOPLE AFFECTED" value={stats.totalAffected.toString()} color="#FF9800" icon={Users} />
                <StatCard title="INJURED" value={stats.totalInjured.toString()} color="#FFC107" icon={AlertTriangle} />
                <StatCard title="CRITICAL" value={stats.totalCritical.toString()} color="#FF3B30" icon={AlertTriangle} />
                <StatCard title="CASUALTIES" value={stats.totalDead.toString()} color="#8E9AAF" icon={XCircle} />
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>RECENT DISASTER SURVEYS</Text>
                {disasterSurveys.slice(-5).reverse().map((survey) => (
                  <SurveyCard key={survey.surveyId} survey={survey} />
                ))}
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>AGRICULTURE DAMAGE</Text>
                {agricultureSurveys.slice(-3).reverse().map((survey) => (
                  <AgricultureCard key={survey.surveyId} survey={survey} />
                ))}
              </View>
            </>
          )}

          {activeTab === 'rescue' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>RESCUE PRIORITY QUEUE</Text>
              <Text style={styles.sectionSubtitle}>Sorted by severity: Critical × 10 + Trapped × 8 + Injured × 2</Text>
              {priorityQueue.map((survey, index) => (
                <PriorityCard key={survey.surveyId} survey={survey} rank={index + 1} />
              ))}
            </View>
          )}

          {activeTab === 'map' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>DISASTER HEATMAP</Text>
              {Platform.OS !== 'web' ? (
                <View style={styles.mapContainer}>
                  <MapView
                    provider={PROVIDER_DEFAULT}
                    style={styles.map}
                    initialRegion={{
                      latitude: 19.1120,
                      longitude: 73.0150,
                      latitudeDelta: 0.05,
                      longitudeDelta: 0.05,
                    }}
                  >
                    {disasterSurveys.filter(s => s.gps).map((survey) => (
                      <Marker
                        key={survey.surveyId}
                        coordinate={{ latitude: survey.gps!.lat, longitude: survey.gps!.lng }}
                        pinColor={survey.trustStatus === 'GREEN' ? 'green' : survey.trustStatus === 'ORANGE' ? 'orange' : 'red'}
                      />
                    ))}
                  </MapView>
                </View>
              ) : (
                <View style={styles.mapPlaceholder}>
                  <MapPin size={48} color="#8E9AAF" />
                  <Text style={styles.mapPlaceholderText}>Map view available on mobile devices</Text>
                </View>
              )}
              <View style={styles.mapLegend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#4CAF50' }]} />
                  <Text style={styles.legendText}>High Trust</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#FF9800' }]} />
                  <Text style={styles.legendText}>Medium Trust</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#FF3B30' }]} />
                  <Text style={styles.legendText}>Low Trust</Text>
                </View>
              </View>
            </View>
          )}

          {activeTab === 'aid' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>AID DISTRIBUTION AUDIT</Text>
              <View style={styles.aidStats}>
                <Text style={styles.aidStat}>Total: {aidDistributions.length}</Text>
                <Text style={styles.aidStat}>Verified: {stats.verifiedAid}</Text>
                <Text style={styles.aidStat}>Pending: {aidDistributions.length - stats.verifiedAid}</Text>
              </View>
              {aidDistributions.slice(-10).reverse().map((aid) => (
                <AidCard key={aid.aidId} aid={aid} />
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function TabButton({ icon: Icon, label, active, onPress }: { icon: any; label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity style={[styles.tab, active && styles.tabActive]} onPress={onPress}>
      <Icon size={16} color={active ? '#0066CC' : '#8E9AAF'} />
      <Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

function StatCard({ title, value, color, icon: Icon }: { title: string; value: string; color: string; icon: any }) {
  return (
    <View style={styles.statCard}>
      <Icon size={20} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );
}

function LocationStatCard({ icon: Icon, title, count, color }: { icon: any; title: string; count: number; color: string }) {
  return (
    <View style={styles.locationStatCard}>
      <Icon size={18} color={color} />
      <Text style={[styles.locationCount, { color }]}>{count}</Text>
      <Text style={styles.locationLabel}>{title}</Text>
    </View>
  );
}

function SurveyCard({ survey }: { survey: any }) {
  const trustColor = survey.trustStatus === 'GREEN' ? '#4CAF50' : survey.trustStatus === 'ORANGE' ? '#FF9800' : '#FF3B30';
  const locationColor = survey.locationStatus === 'Field' ? '#FF3B30' : 
                        survey.locationStatus === 'Shelter' ? '#FF9800' : 
                        survey.locationStatus === 'Hospital' ? '#2196F3' : '#4CAF50';

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardId}>{survey.surveyId}</Text>
        <View style={[styles.trustIndicator, { backgroundColor: trustColor + '20', borderColor: trustColor }]}>
          <Text style={[styles.trustText, { color: trustColor }]}>{survey.trustScore}</Text>
        </View>
      </View>
      <Text style={styles.cardText}>Type: {survey.disasterType} | DigiPin: {survey.digiPin}</Text>
      <View style={styles.cardRow}>
        <Text style={styles.cardText}>Affected: {survey.peopleAffected}</Text>
        <Text style={styles.cardText}>Critical: {survey.critical}</Text>
        <Text style={styles.cardText}>Dead: {survey.dead}</Text>
      </View>
      <View style={styles.locationBadge}>
        <MapPin size={12} color={locationColor} />
        <Text style={[styles.locationBadgeText, { color: locationColor }]}>Location: {survey.locationStatus}</Text>
      </View>
      {survey.officerName && <Text style={styles.cardOfficer}>Officer: {survey.officerName}</Text>}
    </View>
  );
}

function AgricultureCard({ survey }: { survey: any }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardId}>{survey.surveyId}</Text>
        <Text style={styles.damagePercent}>{survey.damagePercent}% damage</Text>
      </View>
      <Text style={styles.cardText}>Crop: {survey.crop}</Text>
      <Text style={styles.cardText}>Cause: {survey.damageCause}</Text>
      <Text style={styles.cardText}>DigiPin: {survey.digiPin}</Text>
    </View>
  );
}

function PriorityCard({ survey, rank }: { survey: any; rank: number }) {
  const priority = survey.critical * 10 + survey.trapped * 8 + survey.injured * 2;
  const urgencyColor = rank <= 3 ? '#FF3B30' : rank <= 6 ? '#FF9800' : '#FFC107';

  return (
    <View style={[styles.priorityCard, { borderLeftColor: urgencyColor }]}>
      <View style={styles.priorityHeader}>
        <View style={[styles.rankBadge, { backgroundColor: urgencyColor }]}>
          <Text style={styles.rankText}>#{rank}</Text>
        </View>
        <Text style={styles.cardId}>{survey.surveyId}</Text>
        <Text style={styles.priorityScore}>Priority: {priority}</Text>
      </View>
      <Text style={styles.cardText}>DigiPin: {survey.digiPin}</Text>
      <View style={styles.priorityStats}>
        <Text style={styles.priorityStat}>🔴 Critical: {survey.critical}</Text>
        <Text style={styles.priorityStat}>⚠️ Trapped: {survey.trapped}</Text>
        <Text style={styles.priorityStat}>🏥 Injured: {survey.injured}</Text>
      </View>
      <Text style={styles.cardText}>Condition: {survey.areaCondition}</Text>
    </View>
  );
}

function AidCard({ aid }: { aid: any }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardId}>{aid.aidId}</Text>
        <View style={[styles.verificationBadge, aid.verified ? styles.verified : styles.unverified]}>
          <Text style={styles.verificationText}>{aid.verified ? '✓ VERIFIED' : '⏳ PENDING'}</Text>
        </View>
      </View>
      <Text style={styles.cardText}>DigiPin: {aid.digiPin}</Text>
      <Text style={styles.cardText}>Type: {aid.aidType} | Quantity: {aid.quantity}</Text>
      {aid.officerName && <Text style={styles.cardOfficer}>Officer: {aid.officerName}</Text>}
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
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
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
    borderColor: "rgba(0, 102, 204, 0.3)",
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
  hqBadge: {
    backgroundColor: "#0D3B66",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  hqBadgeText: {
    color: "#0066CC",
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
    flexWrap: "wrap",
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    gap: 4,
  },
  tabActive: {
    backgroundColor: "#0A1628",
  },
  tabText: {
    fontSize: 12,
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
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: (width - 64) / 2,
    backgroundColor: "#0D1829",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(0, 102, 204, 0.2)",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 8,
  },
  statTitle: {
    fontSize: 11,
    color: "#8E9AAF",
    marginTop: 4,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#8E9AAF",
    marginBottom: 4,
    letterSpacing: 1,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: "#5A6B7F",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#0D1829",
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(0, 102, 204, 0.2)",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardId: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  trustIndicator: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  trustText: {
    fontSize: 12,
    fontWeight: "700",
  },
  cardText: {
    fontSize: 12,
    color: "#C5D0E6",
    marginBottom: 3,
  },
  cardOfficer: {
    fontSize: 11,
    color: "#8E9AAF",
    marginTop: 4,
    fontStyle: "italic" as const,
  },
  damagePercent: {
    fontSize: 12,
    color: "#FF9800",
    fontWeight: "600",
  },
  priorityCard: {
    backgroundColor: "#0D1829",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(0, 102, 204, 0.2)",
    borderLeftWidth: 4,
  },
  priorityHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },
  rankBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  rankText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  priorityScore: {
    fontSize: 11,
    color: "#8E9AAF",
    marginLeft: "auto" as const,
  },
  priorityStats: {
    flexDirection: "row",
    gap: 16,
    marginVertical: 8,
  },
  priorityStat: {
    fontSize: 12,
    color: "#C5D0E6",
    fontWeight: "600",
  },
  aidStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#0D1829",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(0, 102, 204, 0.2)",
  },
  aidStat: {
    fontSize: 12,
    color: "#C5D0E6",
    fontWeight: "600",
  },
  verificationBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  verified: {
    backgroundColor: "#1B5E20",
  },
  unverified: {
    backgroundColor: "#5D4037",
  },
  verificationText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#C5D0E6",
  },
  mapContainer: {
    height: 300,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#1E3A5F",
  },
  map: {
    flex: 1,
  },
  mapPlaceholder: {
    height: 300,
    backgroundColor: "#0D1829",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(0, 102, 204, 0.2)",
  },
  mapPlaceholderText: {
    color: "#8E9AAF",
    fontSize: 14,
    marginTop: 12,
  },
  mapLegend: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#0D1829",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(0, 102, 204, 0.2)",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 11,
    color: "#C5D0E6",
  },
  analyticsCard: {
    backgroundColor: "#0D1829",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(0, 102, 204, 0.2)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  analyticsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  analyticsTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 1,
  },
  analyticsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 16,
  },
  analyticsItem: {
    flex: 1,
    minWidth: "45%",
    alignItems: "center",
    backgroundColor: "#050B18",
    padding: 14,
    borderRadius: 10,
  },
  analyticsValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0066CC",
  },
  analyticsLabel: {
    fontSize: 11,
    color: "#8E9AAF",
    marginTop: 4,
    textAlign: "center" as const,
  },
  trustBreakdown: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#0A1628",
    padding: 12,
    borderRadius: 8,
  },
  trustItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  trustDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  trustLabel: {
    fontSize: 12,
    color: "#C5D0E6",
    fontWeight: "600",
  },
  locationCard: {
    backgroundColor: "#0D1829",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(0, 102, 204, 0.2)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  locationHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  locationTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 1,
  },
  locationGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  locationStatCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#050B18",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    gap: 8,
  },
  locationCount: {
    fontSize: 22,
    fontWeight: "700",
  },
  locationLabel: {
    fontSize: 11,
    color: "#8E9AAF",
    textAlign: "center" as const,
  },
  cardRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 4,
  },
  locationBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    backgroundColor: "#050B18",
    alignSelf: "flex-start" as const,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  locationBadgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
});
