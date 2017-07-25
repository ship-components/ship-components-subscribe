# ship-components-subscribe
Higher order React component to subscribe to a store

[![npm](https://img.shields.io/npm/v/ship-components-subscribe.svg?maxAge=2592000)](https://www.npmjs.com/package/ship-components-subscribe)
[![coverage](https://img.shields.io/coveralls/ship-components/ship-components-subscribe.svg?maxAge=2592000)](https://coveralls.io/github/ship-components/ship-components-subscribe)
[![Build Status](http://img.shields.io/travis/ship-components/ship-components-subscribe/master.svg?style=flat)](https://travis-ci.org/ship-components/ship-components-subscribe)
[![dependencies](https://img.shields.io/david/ship-components/ship-components-subscribe.svg?style=flat)](https://david-dm.org/ship-components/ship-components-subscribe)
[![devDependencies](https://img.shields.io/david/dev/ship-components/ship-components-subscribe.svg?style=flat)](https://david-dm.org/ship-components/ship-components-subscribe?type=dev)


## Basic Usage

```js
// @file ReactComponentSubscribed.js
import ReactComponent from './ReactComponent';
import Store from 'stores/Store';
import Actions from 'actions/Actions';
import subscription from 'ship-components-subscribe';

/**
 * Returns a Component that listens to a store
 * @return    {React.Component}
 */
export default subscription({
  WrappedComponent: ReactComponent,
  Store,
  selectData: store => store.getState(),
  callAction: () => Actions.read(),
  interval: 30000
});

```
The following component isn't directly used since we're wrapping using the higher order component above. Since we don't need to listen to the store we can use a pure function here.
```js
// @file ReactComponent.js
import React from 'react';

export default function ReactComponent(props) {
  const {
    data // This is managed by the subscribe component and is the result of `selectData`
  } = this.props;
  return (
    <div>
      {data}
    </div>
  )
}
```

Once we've wrapped a component we then import the wrapped component.

```js
// @file ExampleView.js
import React from 'react';

// NOTE we're importing the subscribed component here
import ReactComponent from './ReactComponentSubscribed.js';

export function ExampleView(props) {
  return (
    <ReactComponent />
  )
}
```

## Tests

1. `npm install`
2. `npm test`

## History
* 0.1.0 - Initial

## License
The MIT License (MIT)

Copyright (c) SHIP

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
