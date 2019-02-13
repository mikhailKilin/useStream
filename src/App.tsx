import React, { Component } from 'react';
import './App.css';
import { WithStream } from './WithStream';

type TAppProps = {

}

type TAppState = {
  isActive: boolean;
}

class App extends Component<TAppProps, TAppState> {
  readonly state = { isActive: false}

  render() {
    return (
    <div className="App"> 
      {this.state.isActive ? <WithStream count={10} period={300}/> : <WithStream count={0} period={1000}/>}
      <button onClick={this.changeActive}>Switch stream</button>
    </div>
  );
}

  private changeActive = () => {
    this.setState({ isActive: !this.state.isActive})
  }
}

export default App;
