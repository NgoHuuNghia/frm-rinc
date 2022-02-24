
//import Image from "next/image";

const UserProfile = ({user}) => {
    return (
        <div className="box-center">
        <img alt={user.username} src={user.photoURL || '/hacker.png'} className="card-img-center" />
        <p> <i>@{user.username}</i> </p>
        <h1>{user.displayName || 'Anonymous User'}</h1>
    </div>
    );
}

export default UserProfile