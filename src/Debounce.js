/** 
 * A component to debounce rendering
 * 
 * Hierarchy
 *   1. Parent component. E.g. with <input/>
 *   2. Debounce
 *   3. DebounceSCU
 *   4. Child component. E.g. big list or fetch
 * 
 * Explanations:
 *   Why DebounceSCU?
 *     componentWill-Update/-ReceiveProps is deprecated.
 *     componentDidUpdate is the only way to perform safe side-effects.
 *     This means that setTimeout has to be in componentDidUpdate.
 *     On any rerendering of the parent component (e.g input change), 
 *     componentDidUpdate has to be reached to reset setTimeout or render the children.
 *     This mean that shouldComponentUpdate can't be used in this component.
 *     But shouldComponentUpdate is necessary to prevent a rendering of the children.
 *     This is the reason why DebounceSCU which implements shouldComponentUpdate is needed.
 *     Debounce.js acts now like a replacement for componentWill-Update/-ReceiveProps
 * 
 *   Technical key points
 *     1. If the parent did render (e.g. input change) prevProps !== this.props
 *     2. If just Debounce did render (e.g. timer finished => setState()) prevProps === this.props
 *     3. Prevent endless loops of setState, see *
*/

import React from 'react';
import DebounceSCU from './DebounceSCU.js';

class Debounce extends React.Component {
  constructor(props) {
    super(props);
    this.initialComponent = this.props.initialComponent;
    this.state = {
      shouldComponentUpdate: false,
    };
  }

  componentDidMount () {
    this.initialComponent = undefined;
  }

  componentDidUpdate (prevProps) {
    if (prevProps !== this.props) { // Parent did render. E.g. input change
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        clearTimeout(this.timer);
        this.setState({
          shouldComponentUpdate: true,
        });
      }, this.props.ms === undefined ? 250 : this.props.ms);
    }
    else {  // Parent didn't render, but Debounce did through setState()
      if (this.state.shouldComponentUpdate === true) {  // Prevent endless loops
        this.setState({
          shouldComponentUpdate: false, // Reset state
        });
      }
      else {
        // Do nothing * (see 3.)
      }
    }
  }

  componentWillUnmount () {
    clearTimeout(this.timer);
  }
  
  render () {
    return (
      <DebounceSCU shouldComponentUpdate={this.state.shouldComponentUpdate}>
        {this.initialComponent === undefined ? this.props.children : this.initialComponent}
      </DebounceSCU>
    );
  }
}

export default Debounce;
