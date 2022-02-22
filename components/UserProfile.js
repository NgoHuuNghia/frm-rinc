import Image from 'next/Image'

const UserProfile = ({user}) => {
    return (
        <div className="box-center">
        <Image width={50} height={50} alt={user.username} src={user.photoURL || '/hacker.png'} className="card-img-center" />
        <p> <i>@{user.username}</i> </p>
        <h1>{user.displayName || 'Anonymous User'}</h1>
    </div>
    );
}

export default UserProfile