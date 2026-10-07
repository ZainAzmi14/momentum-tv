import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { API_BASE_URL, DASHBOARD_PATH } from '../api/config';
import { DashboardItem, normalizeDashboardItems } from '../api/dashboard';

function DashboardScreen() {
  const [items, setItems] = useState<DashboardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const controller = new AbortController();

    fetch(`${API_BASE_URL}${DASHBOARD_PATH}`, { signal: controller.signal })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Request failed (${response.status})`);
        }
        return response.json() as Promise<unknown>;
      })
      .then(payload => setItems(normalizeDashboardItems(payload)))
      .catch(requestError => {
        if (!controller.signal.aborted) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : 'Unable to load dashboard data',
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Dashboard</Text>
      {loading ? (
        <ActivityIndicator color="#ffffff" />
      ) : error ? (
        <Text style={styles.message}>
          {error}. Check the API URL and dashboard endpoint configuration.
        </Text>
      ) : items.length === 0 ? (
        <Text style={styles.message}>No dashboard items are available.</Text>
      ) : (
        <FlashList
          data={items}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <DashboardCard item={item} />}
        />
      )}
    </View>
  );
}

function DashboardCard({ item }: { item: DashboardItem }) {
  const [focused, setFocused] = useState(false);

  return (
    <Pressable
      focusable
      onBlur={() => setFocused(false)}
      onFocus={() => setFocused(true)}
      style={[styles.card, focused && styles.cardFocused]}
    >
      {item.imageUrl ? (
        <Image
          source={{ uri: item.imageUrl, cache: 'force-cache' }}
          style={styles.image}
        />
      ) : null}
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        {item.description ? (
          <Text style={styles.description}>{item.description}</Text>
        ) : null}
      </View>
    </Pressable>
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
  message: {
    color: '#c6d0d8',
    fontSize: 18,
  },
  card: {
    alignItems: 'center',
    backgroundColor: '#1b2a34',
    borderColor: 'transparent',
    borderRadius: 10,
    borderWidth: 3,
    flexDirection: 'row',
    marginBottom: 14,
    minHeight: 100,
    padding: 16,
  },
  cardFocused: {
    borderColor: '#ffffff',
  },
  image: {
    borderRadius: 6,
    height: 72,
    marginRight: 18,
    width: 128,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '600',
  },
  description: {
    color: '#c6d0d8',
    fontSize: 16,
    marginTop: 6,
  },
});

export default DashboardScreen;
