jest.mock('react-native-gesture-handler', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    GestureHandlerRootView: ({ children }) =>
      React.createElement(View, null, children),
    Swipeable: View,
    DrawerLayout: View,
    State: {},
    ScrollView: View,
    Slider: View,
    Switch: View,
    TextInput: View,
    ToolbarAndroid: View,
    ViewPagerAndroid: View,
    DrawerLayoutAndroid: View,
    WebView: View,
    NativeViewGestureHandler: View,
    TapGestureHandler: View,
    FlingGestureHandler: View,
    ForceTouchGestureHandler: View,
    LongPressGestureHandler: View,
    PanGestureHandler: View,
    PinchGestureHandler: View,
    RotationGestureHandler: View,
    RawButton: View,
    BaseButton: View,
    RectButton: View,
    BorderlessButton: View,
    FlatList: View,
    gestureHandlerRootHOC: (c) => c,
    Directions: {},
  };
});

jest.mock('react-native-screens', () => ({
  enableScreens: jest.fn(),
  screensEnabled: () => false,
}));

const mockUnsub = jest.fn();

jest.mock('@react-native-firebase/auth', () => ({
  getAuth: () => ({ currentUser: null }),
  connectAuthEmulator: jest.fn(),
  onAuthStateChanged: (_auth, cb) => {
    cb(null);
    return mockUnsub;
  },
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock('@react-native-firebase/firestore', () => ({
  getFirestore: () => ({}),
  connectFirestoreEmulator: jest.fn(),
  doc: jest.fn(),
  collection: jest.fn(),
  getDoc: jest.fn(async () => ({ exists: () => false, data: () => undefined })),
  getDocs: jest.fn(async () => ({ docs: [] })),
  addDoc: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
}));

jest.mock('@react-native-firebase/functions', () => ({
  getFunctions: () => ({}),
  connectFunctionsEmulator: jest.fn(),
  httpsCallable: jest.fn(() => jest.fn(async () => ({ data: {} }))),
}));

jest.mock('@react-native-firebase/storage', () => ({
  getStorage: () => ({}),
  connectStorageEmulator: jest.fn(),
}));

jest.mock('@react-native-firebase/app', () => ({
  getApp: () => ({ name: '[DEFAULT]' }),
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('@react-native-community/slider', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: (props) => React.createElement(View, props),
  };
});

jest.mock('react-native-sound', () => {
  class MockSound {
    constructor(filename, basePath, onError) {
      this.filename = filename;
      this.volume = 1;
      this.loops = 0;
      this.playing = false;
      MockSound.instances.push(this);
      const callback = typeof basePath === 'function' ? basePath : onError;
      if (typeof callback === 'function') {
        callback(null, { duration: 1, numberOfChannels: 1 });
      }
    }
    setVolume(value) {
      this.volume = value;
      return this;
    }
    setNumberOfLoops(value) {
      this.loops = value;
      return this;
    }
    play(onEnd) {
      this.playing = true;
      if (typeof onEnd === 'function') {
        onEnd(true);
      }
      return this;
    }
    stop(cb) {
      this.playing = false;
      if (typeof cb === 'function') {
        cb();
      }
      return this;
    }
    pause(cb) {
      this.playing = false;
      if (typeof cb === 'function') {
        cb();
      }
      return this;
    }
    release() {
      return this;
    }
    isLoaded() {
      return true;
    }
    isPlaying() {
      return this.playing;
    }
  }
  MockSound.instances = [];
  MockSound.setCategory = jest.fn();
  MockSound.setActive = jest.fn();
  MockSound.MAIN_BUNDLE = 'MAIN_BUNDLE';
  return MockSound;
});

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    SafeAreaView: View,
    SafeAreaProvider: ({ children }) => React.createElement(View, null, children),
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
    initialWindowMetrics: {
      frame: { x: 0, y: 0, width: 0, height: 0 },
      insets: { top: 0, left: 0, right: 0, bottom: 0 },
    },
  };
});

jest.mock('@react-navigation/native', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    NavigationContainer: ({ children }) => React.createElement(View, null, children),
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    }),
    useRoute: () => ({ params: {} }),
  };
});

const { Image } = require('react-native');
if (typeof Image.resolveAssetSource !== 'function') {
  Image.resolveAssetSource = jest.fn(() => ({
    uri: 'file://mock.wav',
    width: 0,
    height: 0,
    scale: 1,
  }));
}
