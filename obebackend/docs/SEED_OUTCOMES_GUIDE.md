## Seeding Sample PLOs and CLOs

Use this script when you need baseline Program Learning Outcomes (PLOs) and Course Learning Outcomes (CLOs) for demo or testing. It creates three PLOs and links three CLOs each to the `Programming Fundamentals` and `Information Security` courses.

> The script is safe to run multiple times. Existing records are updated, missing ones are created, and nothing is duplicated.

### 1. Activate the backend virtual environment

```bash
cd /home/sanehakanwal/Documents/fista/OBEfinal/OBEfinal/obebackend
source .venv/bin/activate
```

If you are using `uv`, you can skip manual activation and rely on:

```bash
cd /home/sanehakanwal/Documents/fista/OBEfinal/OBEfinal/obebackend
uv run python scripts/seed_outcomes.py
```

### 2. Ensure `DATABASE_URL` is configured

Create or update `obebackend/.env` with the correct connection string, for example:

```env
DATABASE_URL=postgresql://obe_user:SuperSecretPassword@localhost:5432/obe_db
```

### 3. Run the seeding script

```bash
uv run python scripts/seed_outcomes.py
```

You should see log output similar to:

```
INFO: Seeding Program Learning Outcomes (PLOs)...
INFO: PLO PLO1 (1) created.
INFO: PLO PLO2 (2) created.
INFO: PLO PLO3 (3) created.
INFO: Seeding Course Learning Outcomes (CLOs)...
INFO: Processing course 'Programming Fundamentals' (id=5)...
INFO:   CLO CLO1 (12) created.
INFO:   CLO CLO2 (13) created.
INFO:   CLO CLO3 (14) created.
...
INFO: Outcome seeding complete.
```

If a course is missing you will see:

```
WARNING: Skipping course 'Programming Fundamentals' because it was not found. Create the course first in the system.
```

Create the course via the admin UI (or `POST /api/courses`) and run the script again.

### 4. Verify in the admin dashboard

1. Sign in as an admin and open `Manage Outcomes`.
2. The three PLOs should be visible in the PLO table.
3. Select `Programming Fundamentals` or `Information Security` in the course dropdown to review the seeded CLOs.

Once you are comfortable with the workflow, you can manually add PLOs/CLOs for new subjects through the same admin screen:

1. **PLOs** – Use the “Create PLO” form. Pick a unique code (e.g., `PLO4`) and describe the outcome.
2. **CLOs** – Select the relevant course in the dropdown, enter a unique code (e.g., `CLO4`), and add the description.
3. Click the desired action button (`Create`, `Edit`, or `Delete`) and watch the toast notifications for success/error.

This approach keeps your seeding process reproducible while still showing how to manage outcomes manually in the UI. Feel free to edit `scripts/seed_outcomes.py` and re-run it whenever you add new courses that need sample CLOs.

