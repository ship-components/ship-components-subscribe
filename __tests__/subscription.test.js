import React from 'react';
import subscription from '../subscription';

jest.dontMock('react');

test('it should export a function', () => {
  expect(typeof subscription).toBe('function');
});

test('it should return a function', () => {

  function WrappedComponent() {
    return (
      <div>Test</div>
    );
  }

  // Bare bones subscription
  const result = subscription({
    WrappedComponent,
    Store: {},
    selectData: () => null
  });

  expect(typeof result).toBe('function');
});
