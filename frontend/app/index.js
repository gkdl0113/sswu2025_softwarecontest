// app/index.js
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function Sitemap() {
  const router = useRouter();

  const pages = [
    { name: '회원가입 페이지', path: '/pages/SignUpPage' },
    { name: '로그인 페이지', path: '/pages/LoginPage' },
    // 필요하면 여기에 계속 추가
  ];

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
        페이지 목록
      </Text>
      {pages.map((page) => (
        <TouchableOpacity
          key={page.path}
          style={{
            padding: 15,
            backgroundColor: '#eee',
            borderRadius: 5,
            marginBottom: 10,
          }}
          onPress={() => router.push(page.path)}
        >
          <Text>{page.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
