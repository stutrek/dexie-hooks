# dexie-hooks

Dexie hooks make it easy to use Dexie in React. If you're using Dexie.Observable they will respond to changes to the database.

-   `useTable(db.table)` - uses an entire table.
-   `useItem(db.table, id)` - uses a single item in the table.

```typescript
import { useTable, useItem } from 'dexie-hooks';
import db from './my/db';

const AllUsersComponent: React.FC = props => {
    const [allUsers, loading, error] = useTable(db.users);

    if (loading) {
        return <Spinner />;
    }

    if (error) {
        return <div>{error.message}</div>;
    }

    return (
        <ul>
            {allUsers.map(user => (
                <li key={user.id}>{user.name}</li>
            ))}
        </ul>
    );
};

const OneUserComponent: React.FC = props => {
    const [user, loading, error] = useItem(db.users, props.userId);

    if (loading) {
        return <Spinner />;
    }

    if (error) {
        return <div>{error.message}</div>;
    }

    return (
        <div>
            <img src={user.image} /> {user.name}
        </div>
    );
};
```
