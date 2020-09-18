'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
	dbm = options.dbmigrate;
	type = dbm.dataType;
	seed = seedLink;
};

exports.up = function(db) {
	return db.insert('users',{
		username: 'TestVicious',
		password: 'test',
		email: 'test@test.com',
		created: '2020-09-18 00:00:00',
		lastlogin: '2020-09-18 00:00:01',
		active: true
	});
};

exports.down = function(db) {
	return null;
};

exports._meta = {
	"version": 1
};
