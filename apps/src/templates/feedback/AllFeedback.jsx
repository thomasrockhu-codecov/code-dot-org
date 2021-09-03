import React, {Component} from 'react';
import PropTypes from 'prop-types';
import LevelFeedback from '@cdo/apps/templates/feedback/LevelFeedback';
import i18n from '@cdo/locale';
import {levelFeedbackShape} from './types';

class AllFeedback extends Component {
  static propTypes = {
    feedbackByLevel: PropTypes.arrayOf(levelFeedbackShape)
  };

  render() {
    const {feedbackByLevel} = this.props;
    const noFeedback = feedbackByLevel.length === 0;

    return (
      <div>
        <h1 style={styles.header}>{i18n.feedbackAll()}</h1>
        {noFeedback && <div>{i18n.feedbackNoneYet()}</div>}
        {feedbackByLevel.map((levelFeedback, i) => {
          return <LevelFeedback key={i} {...levelFeedback} />;
        })}
      </div>
    );
  }
}

const styles = {
  header: {
    marginBottom: 20
  }
};

export default AllFeedback;
