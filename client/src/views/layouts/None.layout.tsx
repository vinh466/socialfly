import { Link, Outlet } from "react-router-dom";

export default function None() {
    // const { contacts } = useLoaderData();
    return (
        <>
            <div id="sidebar">
                <h1>None Layout</h1>
                <nav>
                    <ul>
                        <li>
                            <Link to={`/feed`}>Feed</Link>
                        </li>
                        <li>
                            <Link to={`/friend`}>Friend</Link>
                        </li>
                        <li>
                            <Link to={`/profile`}>Profile</Link>
                        </li>
                        <li>
                            <Link to={`/login`}>Login</Link>
                        </li>
                        <li>
                            <Link to={`/register`}>Register</Link>
                        </li>
                    </ul>
                </nav>
            </div>
            <div id="detail">
                <Outlet />
            </div>
        </>
    );
}