import * as ping from './ping';
import * as balance from './balance';
import * as register from './register';
import * as transfer from './transfer';
import * as add from './add';
import * as unregister_user from './unregister-user';
import * as register_government from './register-government';

export const commands = {
    ping,
    balance,
    register,
    register_government,
    transfer,
    add,
    unregister_user,
};