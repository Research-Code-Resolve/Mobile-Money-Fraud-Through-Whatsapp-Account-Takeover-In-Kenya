// Splash / entry screen — redirects to welcome
import { Redirect } from 'expo-router';

export default function Index() {
  return <Redirect href="/welcome" />;
}
