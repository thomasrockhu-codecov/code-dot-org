import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Portal from 'react-portal';
import msg from '@cdo/locale';
import color from '../../util/color';
import Dialog, {
  Title,
  Body,
  Footer,
  Confirm,
  Cancel
} from '../../templates/Dialog';
import experiments from '@cdo/apps/util/experiments';

const style = {
  description: {
    fontSize: 'smaller'
  },
  warning: {
    color: color.red,
    fontSize: 'smaller',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 10
  },
  footerButtons: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  buttonGroupSpacing: {
    marginLeft: 15
  }
};

export class ConfirmEnableMakerDialog extends Component {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    handleConfirm: PropTypes.func.isRequired,
    handleCancel: PropTypes.func.isRequired
  };

  render() {
    return (
      <Dialog
        isOpen={this.props.isOpen}
        confirmText={experiments.isEnabled('microbit') ? null : msg.enable()}
        onConfirm={
          experiments.isEnabled('microbit') ? null : this.props.handleConfirm
        }
        onCancel={
          experiments.isEnabled('microbit') ? null : this.props.handleCancel
        }
        handleClose={this.props.handleCancel}
      >
        <Title>{msg.enableMakerDialogTitle()}</Title>
        <Body>
          <div style={style.description}>
            {msg.enableMakerDialogDescription()}{' '}
            <a href="/maker/setup" target="_blank">
              {msg.enableMakerDialogSetupPageLinkText()}
            </a>
          </div>
          {experiments.isEnabled('microbit') ? (
            <div style={style.warning}>{msg.enableMakerDialogWarning()}</div>
          ) : (
            <div style={style.warning}>
              {msg.enableMakerDialogWarningOnlyCP()}
            </div>
          )}
          {experiments.isEnabled('microbit') && (
            <Footer key="footer">
              <div style={style.footerButtons}>
                <Cancel onClick={this.props.handleCancel} />
                <div>
                  <Confirm onClick={this.props.handleConfirm}>
                    {msg.useMicroBit()}
                  </Confirm>
                  <Confirm
                    onClick={this.props.handleConfirm}
                    style={style.buttonGroupSpacing}
                  >
                    {msg.useCircuitPlayground()}
                  </Confirm>
                </div>
              </div>
            </Footer>
          )}
        </Body>
      </Dialog>
    );
  }
}

// Our default export is actually a wrapper around our dialog that renders it
// through a Portal component so it sits at the end of the DOM instead of
// inside whatever component called for it - but this is lousy for testing,
// so we mostly export and test the inner dialog component.
export default class ConfirmEnableMakerDialogPortal extends Component {
  static propTypes = ConfirmEnableMakerDialog.propTypes;
  render() {
    return (
      <Portal isOpened={this.props.isOpen}>
        <ConfirmEnableMakerDialog {...this.props} />
      </Portal>
    );
  }
}
