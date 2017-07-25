import React, { Component } from 'react';
import invariant from 'invariant';
import bluebird from 'bluebird';
import ms from 'ms';

/**
 * Create a component that subscribes to an immutable store.
 * @param    {React.Component}    WrappedComponent    React Component to render with data
 * @param    {ReduceStore}        Store               Store to listen to for changes
 * @param    {function}           selectData          Function to get data out of the store
 * @param    {function}           callActions         Method to update the store from the server
 * @return   {React.Component}
 */
export default function subscription(options = {}) {
  // Defaults
  options = Object.assign({
    dataKey: 'data',
    interval: ms('1m')
  }, options);

  // User options
  const {
    WrappedComponent,
    Store,
    selectData,
    callAction,
    interval,
    dataKey
  } = options;

  // Rename to prevent confusion
  const userShouldComponentUpdate = options.shouldComponentUpdate;

  invariant(
    typeof WrappedComponent === 'function',
    'WrappedComponent is not an function - %s',
    typeof WrappedComponent
  );

  invariant(
    typeof Store === 'object',
    'Store is not an object - %s',
    typeof Store
  );

  invariant(
    typeof selectData === 'function',
    'selectData is not a function - %s',
    typeof selectData
  );

  return class extends Component {
    /**
     * Create it
     */
    constructor(props) {
      super(props);

      // Bindings
      this.handleChange = this.handleChange.bind(this);
      this.handleActionError = this.handleActionError.bind(this);
      this.handleActionSuccess = this.handleActionSuccess.bind(this);
      this.update = this.update.bind(this);

      // Initial state
      this.state = {
        errorStatus: -1,
        [dataKey]: selectData(Store, props)
      };
    }

    /**
     * Start listening for changes
     */
    componentDidMount() {
      this.listener = Store.addListener(this.handleChange);

      if (typeof callAction === 'function') {
        this.update();
      }
    }

    /**
     * Performance Check
     */
    shouldComponentUpdate(nextProps, nextState) {
      if (typeof userShouldComponentUpdate === 'function') {
        console.log('wtf');
        return userShouldComponentUpdate.call(this, nextProps, nextState);
      }
      return true;
    }

    /**
     * Cleanup
     */
    componentWillUnmount() {
      this.listener.remove();
      clearTimeout(this.actionId);
    }

    /**
     * Call the action
     */
    update() {
      const promise = callAction(this.props);
      invariant(
        promise instanceof bluebird,
        'callAction must return a bluebird promise'
      );
      return promise.then(this.handleActionSuccess)
        .catch(this.handleActionError)
        .finally(() => {
          // User setTimeout to ensure we never run at the same time as another
          // request if the request is long and the interval short
          this.actionId = setTimeout(this.update, interval);
        });
    }

    /**
     * Handle any errors
     */
    handleActionError(err) {
      /* istanbul ignore next */
      if (process.env.NODE_ENV !== 'test') {
        console.error(err);
      }
      this.setState({
        errorStatus: err.status || 500
      });
    }

    /**
     * Reset the error status if we succeed
     */
    handleActionSuccess() {
      this.setState({
        errorStatus: -1
      });
    }

    /**
     * Update on changes
     */
    handleChange() {
      this.setState({
        [dataKey]: selectData(Store, this.props)
      });
    }

    /**
     * Render the component with the data
     */
    render() {
      return (
        <WrappedComponent
          {...this.props}
          {...this.state}
        />
      );
    }
  };
}
