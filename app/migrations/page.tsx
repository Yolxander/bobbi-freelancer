import Link from "next/link"
import AddProviderTypesMigration from "./add-provider-types"
import AddBioToProvidersMigration from "./add-bio-to-providers"
// Add the import for our new migration
import AddDeveloperFeaturesMigration from "./add-developer-features"

// Add imports for our new migrations
import AddProviderCollaborationsMigration from "./add-provider-collaborations"
import AddCollaborationProceduresMigration from "./add-collaboration-procedures"
import UpdateCollaborationTablesMigration from "./update-collaboration-tables"
import AddUserIdToClients from "./add-user-id-to-clients"
// Add the import for the AddProjectTimeline component
import AddProjectTimeline from "./add-project-timeline"

export default function MigrationsPage() {
  // Add the new migration to the migrations array in the component
  const migrations = [
    {
      id: "add-developer-features",
      name: "Add Developer Features",
      description: "Adds support for web and software development providers",
      component: <AddDeveloperFeaturesMigration />,
    },
    {
      id: "add-task-issues-table",
      name: "Add Task Issues Table",
      description: "Creates a table to track issues and fixes for tasks",
      path: "/migrations/add-task-issues-table",
    },
    {
      id: "add-provider-collaborations",
      name: "Add Provider Collaborations",
      description: "Adds tables for provider collaborations, invitations, and notifications",
      component: AddProviderCollaborationsMigration,
    },
    {
      id: "add-collaboration-procedures",
      name: "Add Collaboration Procedures",
      description: "Adds stored procedures for handling collaboration operations",
      component: AddCollaborationProceduresMigration,
    },
  ]
  return (
    <div className="container mx-auto py-10 space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">Database Migrations</h1>
        <p className="text-gray-500 mb-6">Run these migrations to update your database schema.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <AddProviderTypesMigration />
        <AddBioToProvidersMigration />
        <AddDeveloperFeaturesMigration />
        <UpdateCollaborationTablesMigration />
        <AddUserIdToClients />
        {/* Add other migrations here */}
        <AddProjectTimeline />
      </div>

      <div className="mt-8 pt-6 border-t">
        <Link href="/dashboard" className="text-blue-500 hover:text-blue-700 transition-colors">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
