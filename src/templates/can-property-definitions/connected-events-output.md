```js
import { Control, StacheElement } from 'can';

class CustomScroll extends StacheElement {
  connected() {
    const EventsControl = Control.extend({
      inserted () {
        const { viewModel } = this;
      },

      '.form click': function (ev) {
        ev.preventDefault();
      }
    });

    new EventsControl(this);
  }
}
```

```js
import { Control, StacheElement } from 'can';

class MyScroll extends StacheElement {
  connected() {
    const EventsControl = Control.extend({
      '.form click': function (ev) {
        ev.preventDefault();
      }
    });

    new EventsControl(this);
  }
}
```
