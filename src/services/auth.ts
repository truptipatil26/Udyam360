import AsyncStorage from "@react-native-async-storage/async-storage";

const USERS_KEY = "udyam360_users";
const CURRENT_USER_KEY = "udyam360_current_user";
const ONBOARDING_KEY = "udyam360_onboarding_completed";

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Profile = {
  state: string;
  district: string;
  village: string;
  capital: string;
  skills: string;
};

export type StoredUser = User & {
  profile?: Profile;
};

// ===============================
// GET ALL USERS
// ===============================

export const getAllUsers = async (): Promise<StoredUser[]> => {
  const data = await AsyncStorage.getItem(USERS_KEY);

  if (!data) {
    return [];
  }

  return JSON.parse(data);
};

// ===============================
// SIGN UP
// ===============================

export const signup = async (
  user: Omit<User, "id">
): Promise<boolean> => {
  const users = await getAllUsers();

  // Check whether email already exists
  const existingUser = users.find(
    (existingUser) =>
      existingUser.email.toLowerCase() === user.email.toLowerCase()
  );

  if (existingUser) {
    return false;
  }

  const newUser: User = {
    ...user,
    id: Date.now().toString(),
  };

  users.push(newUser);

  await AsyncStorage.setItem(
    USERS_KEY,
    JSON.stringify(users)
  );

  return true;
};

// ===============================
// GET CURRENT USER
// ===============================

export const getUser = async (): Promise<StoredUser | null> => {
  const currentUserId = await AsyncStorage.getItem(
    CURRENT_USER_KEY
  );

  if (!currentUserId) {
    return null;
  }

  const users = await getAllUsers();

  const user = users.find(
    (user) => user.id === currentUserId
  );

  return user || null;
};

// ===============================
// LOGIN
// ===============================

export const login = async (
  email: string,
  password: string
): Promise<boolean> => {
  const users = await getAllUsers();

  const user = users.find(
    (user) =>
      user.email.toLowerCase() === email.trim().toLowerCase() &&
      user.password === password
  );

  if (!user) {
    return false;
  }

  await AsyncStorage.setItem(
    CURRENT_USER_KEY,
    user.id
  );

  return true;
};

// ===============================
// CHECK LOGIN
// ===============================

export const isLoggedIn = async (): Promise<boolean> => {
  const currentUser = await getUser();

  return currentUser !== null;
};

// ===============================
// LOGOUT
// ===============================

export const logout = async () => {
  await AsyncStorage.removeItem(CURRENT_USER_KEY);
};

// ===============================
// SAVE PROFILE
// ===============================

export const saveProfile = async (
  profile: Profile
): Promise<boolean> => {
  const currentUserId = await AsyncStorage.getItem(
    CURRENT_USER_KEY
  );

  if (!currentUserId) {
    return false;
  }

  const users = await getAllUsers();

  const userIndex = users.findIndex(
    (user) => user.id === currentUserId
  );

  if (userIndex === -1) {
    return false;
  }

  users[userIndex].profile = profile;

  await AsyncStorage.setItem(
    USERS_KEY,
    JSON.stringify(users)
  );

  return true;
};

// ===============================
// GET CURRENT USER PROFILE
// ===============================

export const getProfile = async (): Promise<Profile | null> => {
  const user = await getUser();

  if (!user || !user.profile) {
    return null;
  }

  return user.profile;
};

// ===============================
// TEMPORARY TESTING
// ===============================

export const clearProfileForTesting = async () => {
  const currentUserId = await AsyncStorage.getItem(
    CURRENT_USER_KEY
  );

  if (!currentUserId) {
    return;
  }

  const users = await getAllUsers();

  const userIndex = users.findIndex(
    (user) => user.id === currentUserId
  );

  if (userIndex === -1) {
    return;
  }

  delete users[userIndex].profile;

  await AsyncStorage.setItem(
    USERS_KEY,
    JSON.stringify(users)
  );
};
// ===============================
// ONBOARDING
// ===============================

export const isOnboardingCompleted = async (): Promise<boolean> => {
  const completed = await AsyncStorage.getItem(ONBOARDING_KEY);

  return completed === "true";
};

export const completeOnboarding = async (): Promise<void> => {
  await AsyncStorage.setItem(
    ONBOARDING_KEY,
    "true"
  );
};
export const resetOnboarding = async (): Promise<void> => {
  await AsyncStorage.removeItem(ONBOARDING_KEY);
};

