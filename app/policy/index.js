const { AbilityBuilder, Ability } = require('@casl/ability');

const policies = {
  guest(user, { can }) {
    can('read', 'Product');
  },
  user(user, { can }) {
    // membaca daftar order
    can('view', 'Order');

    //membuat order
    can('create', 'Order');

    //membaca order miliknya
    can('read', 'Order', { user_id: user._id });

    //mengupdate data dirinya sendiri ('User')
    can('update', 'User', { user_id: user._id });

    //membaca Cart miliknya
    can('read', 'Cart', { user_id: user._id });

    // mengupdate Cart milinya
    can('update', 'Cart', { user_id: user._id });

    // melihat daftar delivery address
    can('view', 'DeliveryAddress');

    // membaut DeliveryAddress
    can('create', 'DeliveryAddress', { user_id: user._id });

    //membaca delivery address miliknya sendiri
    can('read', 'DeliveryAddress', { user_id: user._id });

    //mengupdatae DeliverAddress miliknya
    can('update', 'DeliveryAddress', { user_id: user._id });

    //menghapus DeliveryAddress miliknya
    can('delete', 'DeliveryAddress', { user_id: user._id });

    //membaca invoice miliknya
    can('read', 'Invoice', { user_id: user._id });
  },
  admin(user, { can }) {
    can('manage', 'all');
  },
};

function policyFor(user) {
  let builder = new AbilityBuilder();

  if (user && typeof policies[user.role] === 'function') {
    policies[user.role](user, builder);
  } else {
    policies['guest'](user, builder);
  }

  return new AbilityBuilder(builder.rules);
}

module.exports = { policyFor };
