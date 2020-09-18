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
	return db.createTable('users', {
		id: {
			type: 'int', 
			primaryKey: true, 
			unsigned: true,
			autoIncrement: true,
			length: 10  
		},
		username: {
			type: 'string',
			notNull: true
		},
		password: {
			type: 'string',
			notNull: true
		},
		email: {
			type: 'string',
			notNull: true
		},
		created: {
			type: 'datetime',
			notNull: true
		},
		lastlogin: {
			type: 'datetime',
			notNull: true
		},
		active: {
			type: 'boolean',
			notNull: true,
			defaultValue: true
		}
	});
};

exports.down = function(db) {
	return db.dropTable('users');
};

exports._meta = {
	"version": 1
};
