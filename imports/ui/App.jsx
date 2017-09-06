import React, { Component, PropTypes } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import AppBar from 'material-ui/AppBar';
import { List } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import { createContainer } from 'meteor/react-meteor-data';
import { Link } from 'react-router';
import { LoginButtons } from 'meteor/okgrow:accounts-ui-react';

// Database - Collection
import { Players } from '../api/players';

import TeamList from './Team-list';
import TeamStats from './Team-stats';
import Player from './Player';
import AccountsWrapper from './AccountsWrapper';
import EditPlayer from './Edit-player';

const tempPlayer = {
  name: "Temp Player",
  team: "Temp Team",
  ballManipulation: 0,
  kickingAbilities: 0,
  passingAbilities: 0,
  duelTackling: 0,
  fieldCoverage: 0,
  blockingAbilities: 0,
  gameStrategy: 0,
  playmakingRisks: 0,
  notes: "Temp player Notes",
  //createdAt: new Date(),
  //owner: Meteor.userId(),
}

export default class App extends Component {
  constructor(props) {
    super(props);

    // setting up the state
    this.state = { 
      currentPlayer: tempPlayer,
      showEditPlayer: false,
    };
    this.updateCurrentPlayer = this.updateCurrentPlayer.bind(this);
    this.showEditForm = this.showEditForm.bind(this);
    this.showTeamStats = this.showTeamStats.bind(this);
  }

  renderPlayers() {
    return this.props.players.map((player) => (
      <TeamList key={player._id} player={player} updateCurrentPlayer={this.updateCurrentPlayer} />
    ));
  }

  updateCurrentPlayer(player) {
    this.setState({
      currentPlayer: player,
    });
  }

  showEditForm() {
    this.setState({
      showEditPlayer: true,
    });
  }

  showTeamStats() {
    this.setState({
      showEditPlayer: false,
    });
  }

  showForm() {
    if(this.state.showEditPlayer === true) {
      return ( <EditPlayer currentPlayer={this.state.currentPlayer} 
      showTeamStats={this.showTeamStats}/>);
    } else {
      return ( <TeamStats players={this.props.players}/>);
    }
  }

  render() {
    return (
      <MuiThemeProvider>
        <div className="container">
          <AppBar
            title="Soccer Application"
            iconClassNameRight="muidocs-icon-navigation-expand-more"
            showMenuIconButton={false}
            style={{ backgroundColor: '#0277bd'}}
            >
            <AccountsWrapper />
            </AppBar>

          <div className="row">
            <div className="col s12 m7" ><Player player={this.state.currentPlayer} showEditForm={this.showEditForm} /></div>
            <div className="col s12 m5" >
              <h2>Team list</h2>
              <Link to="/new" className="waves-effect waves-light btn light-blue darken-3">Add Player</Link>
              <Divider/>
                <List>
                  {this.renderPlayers()}
                </List>
              <Divider/>
            </div>
            
          </div>
          <div className="row">
              <div className="col s12" >
              <Divider />
                {this.showForm()}
              </div>
            <Divider />
            </div>
        </div>
      </MuiThemeProvider>
    )
  }
}

App.propTypes = {
  players: PropTypes.array.isRequired,
};

export default createContainer(() => {
  Meteor.subscribe('players');
  const user = Meteor.userId();

  // State is defined here and passing the collection/data as a prop
  return {
    players: Players.find({owner: user}, {sort: { name: 1}}).fetch(),
  };
}, App);