
// import Image from "next/image";
import Image from "next/image";
>>>>>>> f2ab5fca461113fd8c2a23319a9b48e77508cab1

const UserProfile = ({user}) => {
    return (
        <div className="box-center">
        <img alt={user.username} src={user.photoURL || '/hacker.png'} className="card-img-center" />
        <Image alt={user.username} src={user.photoURL || '/hacker.png'} className="card-img-center" />
        <p> <i>@{user.username}</i> </p>
        <h1>{user.displayName || 'Anonymous User'}</h1>
    </div>
    );
}

export default UserProfile