import React from 'react';

class DebounceSCU extends React.Component {

  shouldComponentUpdate (nextProps) {
    return nextProps.shouldComponentUpdate;
  }
  
  render () {
    return (
      this.props.children
    );
  }
}

export default DebounceSCU;
