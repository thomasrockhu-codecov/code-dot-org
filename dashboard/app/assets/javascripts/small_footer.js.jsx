/* $ */

// TODO - this code might better live in shared eventually. doing that would
// require adding JSX transpiling to shared, and the ability to output multiple
// bundles

window.dashboard = window.dashboard || {};

var SmallFooter;

/**
 * Gets our React component SmallFooter. We use a getter so that we don't depend
 * on React being in the global namespace at load time.
 */
window.dashboard.getSmallFooterComponent = function (React) {
  if (SmallFooter) {
    return SmallFooter;
  }

  var EncodedParagraph = React.createClass({
    render: function () {
      return <p dangerouslySetInnerHTML={{
          __html: decodeURIComponent(this.props.text)
      }}/>
    }
  });

  return SmallFooter = React.createClass({
    propTypes: {
      // We let dashboard generate our i18n dropdown and pass it along as an
      // encode string of html
      i18nDropdown: React.PropTypes.string,
      copyrightInBase: React.PropTypes.bool.isRequired,
      copyrightStrings: React.PropTypes.shape({
        thank_you: React.PropTypes.string.isRequired,
        help_from_html: React.PropTypes.string.isRequired,
        art_from_html: React.PropTypes.string.isRequired,
        powered_by_aws: React.PropTypes.string.isRequired,
        trademark: React.PropTypes.string.isRequired
      }),
      baseCopyrightString: React.PropTypes.string,
      baseMoreMenuString: React.PropTypes.string.isRequired,
      baseStyle: React.PropTypes.object,
      menuItems: React.PropTypes.arrayOf(
        React.PropTypes.shape({
          text: React.PropTypes.string.isRequired,
          link: React.PropTypes.string.isRequired
        })
      ).isRequired
    },

    getInitialState: function () {
      return {
        copyrightVisible: false,
        moreVisible: false,
        hidRecently: false,
        copyrightStyle: null,
        moreMenuStyle: null
      };
    },

    hideOnClickAnywhere: function () {
      // The first time we click anywhere, hide any open children
      $(document.body).one('click', function () {
        this.setState({
          copyrightVisible: false,
          moreVisible: false,
          moreOffset: 0,
          hidRecently: true,
        });

        // Create a window during which we can't show again, so that clicking
        // on copyright doesnt immediately hide/reshow
        setTimeout(function () {
          this.setState({ hidRecently: false})
        }.bind(this), 200);
      }.bind(this));
    },

    setVisibility: function (stateName, visible) {
      var newState = {};
      newState[stateName] = visible;

      if (newState[stateName]) {
        this.hideOnClickAnywhere();
      }
      this.setState(newState);
    },

    toggleCopyright: function (event) {
      if (this.state.hidRecently) {
        return;
      }

      this.setVisibility('copyrightVisible', !this.state.copyrightVisible);

      // Adjust bottom padding the first time we show it
      if (!this.state.copyrightStyle) {
        var base = React.findDOMNode(this.refs.base);
        this.setState({
          copyrightStyle: {
            paddingBottom: base.offsetHeight
          }
        });
      }
    },

    toggleMore: function () {
      if (this.state.hidRecently) {
        return;
      }

      this.setVisibility('moreVisible', !this.state.moreVisible);

      // The first time we toggle the more menu, adjust width and align it
      // above small-footer
      if (!this.state.moreMenuStyle) {
        var base = React.findDOMNode(this.refs.base);
        this.setState({
          moreMenuStyle: {
            bottom: base.offsetHeight,
            width: base.offsetWidth,
          }
        });
      }
    },

    render: function () {
      var styles = {
        smallFooter: {
          fontSize: this.props.fontSize
        },
        base: $.extend({}, this.props.baseStyle, {
          paddingBottom: 3,
          paddingTop: 3,
          // subtract top/bottom padding from row height
          height: this.props.rowHeight ? this.props.rowHeight - 6 : undefined
        }),
        copyright: $.extend({}, this.state.copyrightStyle, {
          display: this.state.copyrightVisible ? 'block' : 'none',
          maxHeight: 240,
          overflowY: 'scroll'
        }),
        moreMenu: $.extend({}, this.state.moreMenuStyle, {
          display: this.state.moreVisible ? 'block': 'none'
        }),
        listItem: {
          height: this.props.rowHeight,
          // account for padding (3px on top and bottom) and bottom border (1px)
          // on bottom border on child anchor element
          lineHeight: this.props.rowHeight ?
            (this.props.rowHeight - 6 - 1) + 'px' : undefined
        }
      };

      var caretIcon = this.state.moreVisible ? 'fa fa-caret-down' : 'fa fa-caret-up';

      return (
        <div style={styles.smallFooter}>
          <div className="small-footer-base" ref="base" style={styles.base}>
            <div dangerouslySetInnerHTML={{
                __html: decodeURIComponent(this.props.i18nDropdown)
            }}/>
            <small>
              {this.renderCopyright()}
              <a className="more-link" href="javascript:void(0)"
                onClick={this.toggleMore}>
                {this.props.baseMoreMenuString + ' '}
                <i className={caretIcon}/>
              </a>
            </small>
          </div>
          <div id="copyright-flyout" style={styles.copyright}>
            <EncodedParagraph text={this.props.copyrightStrings.thank_you}/>
            <p>{this.props.copyrightStrings.help_from_html}</p>
            <EncodedParagraph text={this.props.copyrightStrings.art_from_html}/>
            <p>{this.props.copyrightStrings.powered_by_aws}</p>
            <EncodedParagraph text={this.props.copyrightStrings.trademark}/>
          </div>
          {this.renderMoreMenu(styles)}
        </div>
      );
    },

    renderCopyright() {
      if (this.props.copyrightInBase) {
        return (
          <span>
            <a className="copyright-link" href="javascript:void(0)"
              onClick={this.toggleCopyright}>
              {this.props.baseCopyrightString}
            </a>
            &nbsp;&nbsp;|&nbsp;&nbsp;
          </span>
        );
      }
    },

    renderMoreMenu(styles) {
      var menuItemElements = this.props.menuItems.map(function (item, index) {
        var onClick;
        if (item.copyright) {
          onClick = this.setVisibility.bind(null, 'copyrightVisible', true);
        }
        return <li key={index} style={styles.listItem}>
          <a href={item.link} onClick={onClick}>{item.text}</a>
        </li>
      }.bind(this));
      return (
        <ul id="more-menu" style={styles.moreMenu}>
          {menuItemElements}
        </ul>
      );
    }
  });
}
