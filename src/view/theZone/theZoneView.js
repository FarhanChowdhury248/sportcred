import * as React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Button} from 'react-native-paper';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {PostSummary} from './../../components/index.js';

import {getPostIds} from './../../controller/TheZoneController';

export function TheZoneContentView({navigation}) {
  const [postIds, updatePostIds] = React.useState([]);
  if (postIds.length === 0) {
    getPostIds().then((post) => {
      updatePostIds(post);
    });
  }
  function renderButtons(nav) {
    return postIds.map((id) => {
      return <PostSummary postId={id} key={id} navigation={nav} />;
    });
  }
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View>
            <Text style={styles.titleText}>THE ZONE</Text>
          </View>

          <Button
            mode="contained"
            onPress={() => {
              navigation.navigate('Create Post');
            }}>
            Create Post
          </Button>

          {renderButtons(navigation)}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  titleText: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 35,
    padding: 10,
    margin: 10,
  },
  logo: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
  },
  scrollView: {
    backgroundColor: Colors.lighter,
  },
});
