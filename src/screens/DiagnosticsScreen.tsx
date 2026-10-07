import { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import DeviceInfo from 'react-native-device-info';

type Diagnostics = {
  model: string;
  os: string;
  memory: string;
  network: string;
  resolution: string;
};

function formatMemory(bytes: number): string {
  return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
}

function DiagnosticsScreen() {
  const [diagnostics, setDiagnostics] = useState<Diagnostics>();

  useEffect(() => {
    let mounted = true;

    Promise.all([
      DeviceInfo.getModel(),
      DeviceInfo.getSystemVersion(),
      DeviceInfo.getTotalMemory(),
      NetInfo.fetch(),
    ])
      .then(([model, os, memory, network]) => {
        if (!mounted) {
          return;
        }

        const { height, width } = Dimensions.get('screen');
        const connection = network.isConnected
          ? `${network.type}${
              network.isInternetReachable === false ? ' (no internet)' : ''
            }`
          : 'Disconnected';

        setDiagnostics({
          model,
          os,
          memory: formatMemory(memory),
          network: connection,
          resolution: `${Math.round(width)} × ${Math.round(height)}`,
        });
      })
      .catch(() => {
        if (mounted) {
          setDiagnostics({
            model: 'Unavailable',
            os: 'Unavailable',
            memory: 'Unavailable',
            network: 'Unavailable',
            resolution: 'Unavailable',
          });
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const values: [string, string][] = diagnostics
    ? [
        ['Model', diagnostics.model],
        ['OS', diagnostics.os],
        ['RAM', diagnostics.memory],
        ['Network', diagnostics.network],
        ['Resolution', diagnostics.resolution],
      ]
    : [];

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Device diagnostics</Text>
      {values.length > 0 ? (
        values.map(([label, value]) => (
          <View key={label} style={styles.row}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.value}>Loading device information…</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heading: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: '600',
    marginBottom: 20,
  },
  row: {
    borderBottomColor: '#354650',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  label: {
    color: '#c6d0d8',
    fontSize: 18,
  },
  value: {
    color: '#ffffff',
    fontSize: 18,
  },
});

export default DiagnosticsScreen;
