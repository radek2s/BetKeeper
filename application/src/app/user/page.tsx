import {PrismaClient} from '../../../generated/prisma'
import { createUser } from '../actions/createUser'
import { UserCreateForm } from './form'

const prisma = new PrismaClient()

export default async function Users() {
    const allUsers = await prisma.user.findMany()
    

    return <div>
        <h1>Users</h1>
        <ul>
            {allUsers.map((user) => <li key={user.id}>{user.firstName} {user.lastName}</li>)}
        </ul>

        <UserCreateForm/>


    </div>
}
