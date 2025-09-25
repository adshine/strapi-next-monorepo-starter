/**
 * Migration script to rename download-related fields and collections to remix terminology
 * This script should be run as a database migration in Strapi
 */

module.exports = {
  async up(knex) {
    console.log("Starting migration: Renaming download terminology to remix...")

    // 1. Rename columns in the projects table
    if (await knex.schema.hasColumn("projects", "download_url")) {
      await knex.schema.alterTable("projects", (table) => {
        table.renameColumn("download_url", "remix_url")
      })
      console.log("✓ Renamed projects.download_url to remix_url")
    }

    if (await knex.schema.hasColumn("projects", "download_count")) {
      await knex.schema.alterTable("projects", (table) => {
        table.renameColumn("download_count", "remix_count")
      })
      console.log("✓ Renamed projects.download_count to remix_count")
    }

    // 2. Rename columns in the user_profiles table
    if (await knex.schema.hasColumn("user_profiles", "daily_downloads_used")) {
      await knex.schema.alterTable("user_profiles", (table) => {
        table.renameColumn("daily_downloads_used", "daily_remixes_used")
      })
      console.log(
        "✓ Renamed user_profiles.daily_downloads_used to daily_remixes_used"
      )
    }

    if (
      await knex.schema.hasColumn("user_profiles", "monthly_downloads_used")
    ) {
      await knex.schema.alterTable("user_profiles", (table) => {
        table.renameColumn("monthly_downloads_used", "monthly_remixes_used")
      })
      console.log(
        "✓ Renamed user_profiles.monthly_downloads_used to monthly_remixes_used"
      )
    }

    if (
      await knex.schema.hasColumn("user_profiles", "monthly_downloads_limit")
    ) {
      await knex.schema.alterTable("user_profiles", (table) => {
        table.renameColumn("monthly_downloads_limit", "monthly_remixes_limit")
      })
      console.log(
        "✓ Renamed user_profiles.monthly_downloads_limit to monthly_remixes_limit"
      )
    }

    if (await knex.schema.hasColumn("user_profiles", "total_downloads")) {
      await knex.schema.alterTable("user_profiles", (table) => {
        table.renameColumn("total_downloads", "total_remixes")
      })
      console.log("✓ Renamed user_profiles.total_downloads to total_remixes")
    }

    if (await knex.schema.hasColumn("user_profiles", "download_lock_version")) {
      await knex.schema.alterTable("user_profiles", (table) => {
        table.renameColumn("download_lock_version", "remix_lock_version")
      })
      console.log(
        "✓ Renamed user_profiles.download_lock_version to remix_lock_version"
      )
    }

    // 3. Rename columns in the plans table
    if (await knex.schema.hasColumn("plans", "daily_download_limit")) {
      await knex.schema.alterTable("plans", (table) => {
        table.renameColumn("daily_download_limit", "daily_remix_limit")
      })
      console.log("✓ Renamed plans.daily_download_limit to daily_remix_limit")
    }

    if (await knex.schema.hasColumn("plans", "allows_bulk_download")) {
      await knex.schema.alterTable("plans", (table) => {
        table.renameColumn("allows_bulk_download", "allows_bulk_remix")
      })
      console.log("✓ Renamed plans.allows_bulk_download to allows_bulk_remix")
    }

    if (await knex.schema.hasColumn("plans", "monthly_download_limit")) {
      await knex.schema.alterTable("plans", (table) => {
        table.renameColumn("monthly_download_limit", "monthly_remix_limit")
      })
      console.log(
        "✓ Renamed plans.monthly_download_limit to monthly_remix_limit"
      )
    }

    // 4. Create template_access_logs table by copying structure from download_logs
    if (
      (await knex.schema.hasTable("download_logs")) &&
      !(await knex.schema.hasTable("template_access_logs"))
    ) {
      // Create new table
      await knex.schema.createTable("template_access_logs", (table) => {
        table.increments("id").primary()
        table.integer("user").unsigned()
        table.integer("project").unsigned()
        table.string("access_id").notNullable().unique() // renamed from download_id
        table
          .enum("status", ["pending", "success", "failed", "expired"])
          .defaultTo("pending")
          .notNullable()
        table.datetime("initiated_at")
        table.datetime("completed_at")
        table.datetime("expires_at")
        table.text("remix_url") // renamed from signed_url
        table.string("remix_url_hash") // renamed from signed_url_hash
        table.datetime("issued_at")
        table.string("ip_address")
        table.text("user_agent")
        table.string("source_ip")
        table.integer("attempt_number").defaultTo(1)
        table.integer("retry_of").unsigned()
        table.boolean("quota_charged").defaultTo(false)
        table.text("error_reason")
        table.string("error_code")
        table.string("support_ticket_id")
        table.integer("access_duration") // renamed from download_duration
        table.bigInteger("template_size") // renamed from file_size
        table.json("metadata")
        table.timestamps(false, true)

        // Add indexes
        table.index(["user"])
        table.index(["project"])
        table.index(["status"])
        table.index(["initiated_at"])
      })
      console.log("✓ Created template_access_logs table")

      // Copy data from download_logs to template_access_logs
      const downloadLogs = await knex("download_logs").select("*")

      if (downloadLogs.length > 0) {
        const templateAccessLogs = downloadLogs.map((log) => ({
          id: log.id,
          user: log.user,
          project: log.project,
          access_id: log.download_id,
          status: log.status,
          initiated_at: log.initiated_at,
          completed_at: log.completed_at,
          expires_at: log.expires_at,
          remix_url: log.signed_url,
          remix_url_hash: log.signed_url_hash,
          issued_at: log.issued_at,
          ip_address: log.ip_address,
          user_agent: log.user_agent,
          source_ip: log.source_ip,
          attempt_number: log.attempt_number,
          retry_of: log.retry_of,
          quota_charged: log.quota_charged,
          error_reason: log.error_reason,
          error_code: log.error_code,
          support_ticket_id: log.support_ticket_id,
          access_duration: log.download_duration,
          template_size: log.file_size,
          metadata: log.metadata,
          created_at: log.created_at,
          updated_at: log.updated_at,
        }))

        await knex("template_access_logs").insert(templateAccessLogs)
        console.log(
          `✓ Migrated ${downloadLogs.length} records from download_logs to template_access_logs`
        )
      }
    }

    console.log("Migration completed successfully!")
  },

  async down(knex) {
    console.log("Rolling back migration: Reverting to download terminology...")

    // Reverse all the changes
    // 1. Revert projects table
    if (await knex.schema.hasColumn("projects", "remix_url")) {
      await knex.schema.alterTable("projects", (table) => {
        table.renameColumn("remix_url", "download_url")
      })
    }

    if (await knex.schema.hasColumn("projects", "remix_count")) {
      await knex.schema.alterTable("projects", (table) => {
        table.renameColumn("remix_count", "download_count")
      })
    }

    // 2. Revert user_profiles table
    if (await knex.schema.hasColumn("user_profiles", "daily_remixes_used")) {
      await knex.schema.alterTable("user_profiles", (table) => {
        table.renameColumn("daily_remixes_used", "daily_downloads_used")
      })
    }

    if (await knex.schema.hasColumn("user_profiles", "monthly_remixes_used")) {
      await knex.schema.alterTable("user_profiles", (table) => {
        table.renameColumn("monthly_remixes_used", "monthly_downloads_used")
      })
    }

    if (await knex.schema.hasColumn("user_profiles", "monthly_remixes_limit")) {
      await knex.schema.alterTable("user_profiles", (table) => {
        table.renameColumn("monthly_remixes_limit", "monthly_downloads_limit")
      })
    }

    if (await knex.schema.hasColumn("user_profiles", "total_remixes")) {
      await knex.schema.alterTable("user_profiles", (table) => {
        table.renameColumn("total_remixes", "total_downloads")
      })
    }

    if (await knex.schema.hasColumn("user_profiles", "remix_lock_version")) {
      await knex.schema.alterTable("user_profiles", (table) => {
        table.renameColumn("remix_lock_version", "download_lock_version")
      })
    }

    // 3. Revert plans table
    if (await knex.schema.hasColumn("plans", "daily_remix_limit")) {
      await knex.schema.alterTable("plans", (table) => {
        table.renameColumn("daily_remix_limit", "daily_download_limit")
      })
    }

    if (await knex.schema.hasColumn("plans", "allows_bulk_remix")) {
      await knex.schema.alterTable("plans", (table) => {
        table.renameColumn("allows_bulk_remix", "allows_bulk_download")
      })
    }

    if (await knex.schema.hasColumn("plans", "monthly_remix_limit")) {
      await knex.schema.alterTable("plans", (table) => {
        table.renameColumn("monthly_remix_limit", "monthly_download_limit")
      })
    }

    // 4. Drop template_access_logs table if it exists
    if (await knex.schema.hasTable("template_access_logs")) {
      await knex.schema.dropTable("template_access_logs")
    }

    console.log("Rollback completed successfully!")
  },
}
