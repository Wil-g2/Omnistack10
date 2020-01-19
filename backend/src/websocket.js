const socketio = require('socket.io'); 
const parseStringAsArray = require('./utils/parseStringAsArray'); 
const calculateDistance = require('./utils/calculateDistance'); 

let io; 
const connections = [];

exports.setupWebsocket = (server) => {
  io = socketio(server); 

  io.on('connection', socket => {   
   const { latitude, longitude, techs } = socket.handshake.query; 

    //storege connections of socket.io
    connections.push({
      id: socket.id, 
      coordinates: {
        latitute: Number(latitude), 
        longitude: Number(longitude)
      }, 
      techs: parseStringAsArray(techs),
    });   
  }); 
};

exports.findConnecitons = (coordinates, techs) => {  
  return connections.filter(connection => {
    return (calculateDistance(coordinates, connection.coordinates ) < 12 
      && connection.techs.some(item => techs.includes(item)));
  }); 
};

exports.sendMessage = (to, message, data) => {
  console.log('sendMessage:'+data);
  to.forEach(connection => {
    io.to(connection.id).emit(message, data);
  });
};