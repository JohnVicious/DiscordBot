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
	return db.createTable('serveradmins', {
		id: { 
			type: 'int', 
			primaryKey: true,
			unsigned: true, 
			autoIncrement: true,
			length: 10  
		},
		userid: {
			type: 'int',
			notNull: true,			
			unsigned: true,
			length: 10,
			foreignKey: {
				name: 'serveradmins_userid_id_fk',
				table: 'users',
				rules: {
				  onDelete: 'RESTRICT',
				  onUpdate: 'RESTRICT'
				},
				mapping: {
					userid: 'id'
				}
			}
		},
		serverid: {
			type: 'int',
			notNull: true,
			unsigned: true,
			length: 10,
			foreignKey: {
				name: 'serveradmins_serverid_id_fk',
				table: 'servers',
				rules: {
				  onDelete: 'RESTRICT',
				  onUpdate: 'RESTRICT'
				},
				mapping: {
					serverid: 'id'
				}
			}
		},
		created: {
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
	return db.dropTable('serveradmins');
};

exports._meta = {
	"version": 1
};
