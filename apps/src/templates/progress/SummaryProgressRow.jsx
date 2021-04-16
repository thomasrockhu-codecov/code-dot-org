import PropTypes from 'prop-types';
import React from 'react';
import color from '@cdo/apps/util/color';
import ReactTooltip from 'react-tooltip';
import ProgressBubbleSet from './ProgressBubbleSet';
import FontAwesome from '@cdo/apps/templates/FontAwesome';
import {levelType, lessonType} from './progressTypes';
import {ViewType} from '@cdo/apps/code-studio/viewAsRedux';
import FocusAreaIndicator from './FocusAreaIndicator';
import _ from 'lodash';
import i18n from '@cdo/locale';

export const styles = {
  lightRow: {
    backgroundColor: color.table_light_row
  },
  darkRow: {
    backgroundColor: color.table_dark_row
  },
  hiddenRow: {
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: color.border_gray,
    backgroundColor: color.table_light_row
  },
  col1: {
    width: 200,
    minWidth: 200,
    maxWidth: 200,
    lineHeight: '52px',
    color: color.charcoal,
    letterSpacing: -0.11,
    whiteSpace: 'nowrap',
    paddingLeft: 20,
    paddingRight: 20,
    borderRightWidth: 1,
    borderRightColor: color.border_light_gray,
    borderRightStyle: 'solid'
  },
  col2: {
    position: 'relative',
    width: '100%',
    paddingLeft: 20,
    paddingRight: 20
  },
  // When we set our opacity on the row element instead of on individual tds,
  // there are weird interactions with our tooltips in Chrome, and borders end
  // up disappearing.
  fadedCol: {
    opacity: 0.6
  },
  colText: {
    color: color.charcoal,
    fontFamily: '"Gotham 5r", sans-serif',
    fontSize: 12,
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  icon: {
    marginRight: 5,
    fontSize: 12,
    color: color.cyan
  },
  locked: {
    borderStyle: 'dashed',
    borderWidth: 2
  },
  unlockedIcon: {
    color: color.orange
  },
  focusAreaMargin: {
    // Our focus area indicator is absolutely positioned. Add a margin when it's
    // there so that it wont overlap dots.
    marginRight: 130
  },
  opaque: {
    opacity: 1
  }
};

export default class SummaryProgressRow extends React.Component {
  static propTypes = {
    dark: PropTypes.bool.isRequired,
    lesson: lessonType.isRequired,
    levels: PropTypes.arrayOf(levelType).isRequired,
    viewAs: PropTypes.oneOf(Object.keys(ViewType)),
    lessonIsVisible: PropTypes.func.isRequired,
    lessonIsLockedForUser: PropTypes.func.isRequired,
    lockableAuthorized: PropTypes.bool.isRequired
  };

  render() {
    const {
      dark,
      lesson,
      levels,
      lessonIsVisible,
      lessonIsLockedForUser,
      lockableAuthorized,
      viewAs
    } = this.props;

    // Would this lesson be hidden if we were a student?
    const hiddenForStudents = !lessonIsVisible(lesson, ViewType.Student);
    const locked = lessonIsLockedForUser(lesson, levels, viewAs);
    const hiddenOrLocked = hiddenForStudents || locked;

    let lessonTitle = lesson.name;
    if (lesson.stageNumber) {
      lessonTitle = lesson.stageNumber + '. ' + lessonTitle;
    }

    const titleTooltipId = _.uniqueId();
    const lockedTooltipId = _.uniqueId();
    return (
      <tr
        style={{
          ...(!dark && styles.lightRow),
          ...(dark && styles.darkRow),
          ...(hiddenForStudents && styles.hiddenRow),
          ...(locked && styles.locked),
          ...(viewAs === ViewType.Teacher && styles.opaque)
        }}
      >
        <td
          style={{
            ...styles.col1,
            ...(hiddenOrLocked &&
              !(viewAs === ViewType.Teacher && lockableAuthorized) &&
              styles.fadedCol)
          }}
        >
          <div style={styles.colText}>
            {hiddenForStudents && (
              <FontAwesome icon="eye-slash" style={styles.icon} />
            )}
            {lesson.lockable && (
              <span data-tip data-for={lockedTooltipId}>
                <FontAwesome
                  icon={locked ? 'lock' : 'unlock'}
                  style={{
                    ...styles.icon,
                    ...(!locked && styles.unlockedIcon)
                  }}
                />
                {!locked && viewAs === ViewType.Teacher && (
                  <ReactTooltip
                    id={lockedTooltipId}
                    role="tooltip"
                    wrapper="span"
                    effect="solid"
                  >
                    {i18n.lockAssessmentLong()}
                  </ReactTooltip>
                )}
              </span>
            )}
            <span
              data-tip
              data-for={titleTooltipId}
              aria-describedby={titleTooltipId}
            >
              {lessonTitle}
              <ReactTooltip
                id={titleTooltipId}
                role="tooltip"
                wrapper="span"
                effect="solid"
              >
                {lesson.name}
              </ReactTooltip>
            </span>
          </div>
        </td>
        <td
          style={{
            ...styles.col2,
            ...(hiddenOrLocked &&
              !(viewAs === ViewType.Teacher && lockableAuthorized) &&
              styles.fadedCol)
          }}
        >
          {levels.length === 0 ? (
            i18n.lessonContainsNoLevels()
          ) : (
            <ProgressBubbleSet
              levels={levels}
              disabled={locked}
              style={lesson.isFocusArea ? styles.focusAreaMargin : undefined}
            />
          )}
          {lesson.isFocusArea && <FocusAreaIndicator />}
        </td>
      </tr>
    );
  }
}
