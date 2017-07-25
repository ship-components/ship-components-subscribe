import React from 'react';
import Promise from 'bluebird';
import { mount } from 'enzyme';
import subscription from '../subscription';

/**
 * Mock Store
 * @type    {Object}
 */
const MockStore = {
  addListener() {
    return {
      remove: () => {}
    };
  }
};

/**
 * Basic react component
 * @constructor
 */
function WrappedComponent() {
  return (
    <div>Test</div>
  );
}

test('it should render the WrappedComponent', () => {
  // Bare bones subscription
  const Result = subscription({
    WrappedComponent,
    Store: MockStore,
    selectData: () => null
  });

  const wrapper = mount(<Result />);
  expect(wrapper.contains(<div>Test</div>)).toBe(true);
});


test('it should call selectData and set its state to the result', () => {

  const data = { test: true };

  const selectData = jest.fn();
  selectData.mockReturnValueOnce(data);

  // Bare bones subscription
  const Result = subscription({
    WrappedComponent,
    Store: MockStore,
    selectData
  });

  const wrapper = mount(<Result />);
  expect(wrapper.state('data')).toBe(data);
});

test('it should support changing the dataKey prop', () => {
  const data = { test: true };

  const selectData = jest.fn();
  selectData.mockReturnValueOnce(data);

  const dataKey = 'test';

  // Bare bones subscription
  const Result = subscription({
    WrappedComponent,
    Store: MockStore,
    selectData,
    dataKey
  });

  const wrapper = mount(<Result />);
  expect(wrapper.state(dataKey)).toBe(data);
});

test('it should listen to changes from a flux store', () => {
  const data = { test: true };

  const selectData = jest.fn();
  selectData.mockReturnValueOnce({});
  selectData.mockReturnValueOnce(data);

  let changeHandler;

  // Bare bones subscription
  const Result = subscription({
    WrappedComponent,
    Store: {
      addListener(fn) {
        changeHandler = fn;
        return {
          remove: () => {}
        };
      }
    },
    selectData
  });

  const wrapper = mount(<Result />);
  changeHandler();
  expect(wrapper.state('data')).toBe(data);
  expect(selectData.mock.calls.length).toBe(2);
});

test('it should stop listening to changes from a flux store when unmounted', () => {
  const data = { test: true };

  const selectData = jest.fn().mockReturnValue(data);

  const remove = jest.fn();

  // Bare bones subscription
  const Result = subscription({
    WrappedComponent,
    Store: {
      addListener() {
        return {
          remove
        };
      }
    },
    selectData
  });

  const wrapper = mount(<Result />);
  wrapper.unmount();
  expect(remove.mock.calls.length).toBe(1);
});

test('it should call callAction if supplied', () => {
  const data = { test: true };

  const selectData = jest.fn().mockReturnValueOnce(data);

  const callAction = jest.fn().mockReturnValue(Promise.resolve(null));

  // Bare bones subscription
  const Result = subscription({
    WrappedComponent,
    Store: MockStore,
    callAction,
    selectData
  });

  const wrapper = mount(<Result />);
  expect(wrapper.state('data')).toBe(data);
  expect(callAction.mock.calls.length).toBe(1);
});

test('it should set state.errorStatus to error.status if the callAction promise fails', (done) => {
  const selectData = jest.fn().mockReturnValueOnce({});

  const errorStatus = 403;
  const err = new Error('Test Error');
  err.status = errorStatus;

  const callAction = jest.fn().mockReturnValue(Promise.reject(err));

  // Bare bones subscription
  const Result = subscription({
    WrappedComponent,
    Store: MockStore,
    callAction,
    selectData
  });

  const wrapper = mount(<Result />);

  // Wait for next render cycle so setState takes effect
  setTimeout(() => {
    expect(callAction.mock.calls.length).toBe(1);
    expect(wrapper.state('errorStatus')).toBe(errorStatus);
    done();
  }, 0);
});
