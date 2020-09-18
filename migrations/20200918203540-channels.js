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
	return db.createTable('channels', {
		id: { 
			type: 'int', 
			primaryKey: true, 
			unsigned: true,
			autoIncrement: true,
			length: 10  
		},
		serverid: {
			type: 'int',
			notNull: true,			
			unsigned: true,
			foreignKey: {
				name: 'channels_serverid_id_fk',
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
		channeltypeid: {
			type: 'int',
			notNull: true,
			unsigned: true,
			foreignKey: {
				name: 'channels_channeltypeid_id_fk',
				table: 'channeltypes',
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
	return db.dropTable('channels');
};

exports._meta = {
	"version": 1
};
