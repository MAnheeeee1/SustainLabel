// app/dashboard/page.tsx
import { getAllPages } from "../../lib/get-page";
import Link from "next/link";

export default function Dashboard() {
  const pages = getAllPages(); // returns { path: string, title: string }[]

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 40 }}>
      <h1>Dashboard</h1>

      {/* Create new page */}
      <form action="/dashboard/create" method="POST">
        <input name="path" placeholder="/product/new-page" required />
        <button type="submit">Create New Page</button>
      </form>

      {/* List existing pages */}
      <h2>Published Pages</h2>
      <table>
        <thead>
          <tr>
            <th>Path</th>
            <th>Title</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pages.map((page) => (
            <tr key={page.path}>
              <td>{page.path}</td>
              <td>{page.title}</td>
              <td>
                <Link href={page.path}>View</Link>
                {" | "}
                <Link href={`${page.path}/edit`}>Edit</Link>
                {" | "}
                <button>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const dynamic = "force-dynamic";
