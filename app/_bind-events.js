var _ = require('underscore')

module.exports = function(dom, state, events) {
  /* Binds DOM events in the form:
   *    <e>: <handler>
   *
   *  Where <e> is of the form:
   *    "<evt>[ <evt>, ...] / <selector>"
   *      - (both spaces surrounding the "/" are optional)
   *
   *  <handler> is passed arguments: (evt, state[, state, ...])
   *
   *  Example: { "click / .submit": function(evt, state) {} } }
   */
  
  _.each(events||{}, function(handler, evt) {
    var _split = evt.split(/ ?\/ ?/)

    if (_split.length == 1)
      _split.push('');

    var evt = _split[0]
      , selector = _split[1]

    if (evt == 'render') {
      // laf provides a custom 'render' event.
      // TODO: how to bind to this w/ jquery?
      dom && dom.addEventListener('render', function(evt) {
        handler.apply(dom, [evt].concat(state))
      })
    } else {
      dom && $(dom).on(evt, selector, function(evt) {
        handler.apply(this, [evt].concat(state))
      })
    }
  })
}

