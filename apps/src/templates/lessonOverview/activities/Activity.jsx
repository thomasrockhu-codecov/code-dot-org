import PropTypes from 'prop-types';
import React, {Component} from 'react';
import ActivitySection from '@cdo/apps/templates/lessonOverview/activities/ActivitySection';
import color from '@cdo/apps/util/color';
import {activityShape} from '@cdo/apps/templates/lessonOverview/lessonPlanShapes';
import i18n from '@cdo/locale';

const styles = {
  activityHeader: {
    color: color.purple
  }
};

export default class Activity extends Component {
  static propTypes = {
    activity: activityShape,
    isCSF: PropTypes.bool
  };

  render() {
    const {activity} = this.props;

    return (
      <div>
        <h2 style={styles.activityHeader} id={`activity-${activity.key}`}>
          {activity.displayName}
          {activity.duration > 0 && (
            <span>
              {i18n.activityHeaderTime({
                activityDuration: activity.duration
              })}
            </span>
          )}
        </h2>
        {activity.activitySections.map(item => {
          return (
            <ActivitySection
              key={item.key}
              section={item}
              isCSF={this.props.isCSF}
            />
          );
        })}
      </div>
    );
  }
}
