#!/usr/bin/env bash
set -euo pipefail

# Optional: print versions for diagnostics
echo "[entrypoint] Using lpr at: $(command -v lpr || echo 'not found')"
echo "[entrypoint] cupsd at: $(command -v cupsd || echo 'not found')"

# Start dbus if available (some devices/discovery flows rely on it)
if command -v dbus-daemon >/dev/null 2>&1; then
  echo "[entrypoint] Starting dbus..."
  # Create runtime dir if missing
  if [ ! -d /var/run/dbus ]; then
    mkdir -p /var/run/dbus
  fi
  # If not running, start system bus
  if ! pgrep -x dbus-daemon >/dev/null 2>&1; then
    dbus-daemon --system --nofork --nopidfile --syslog &
    DBUS_PID=$!
    echo "[entrypoint] dbus-daemon pid: $DBUS_PID"
  fi
else
  echo "[entrypoint] dbus-daemon not installed; continuing..."
fi

# Optional: make CUPS accessible on LAN and share printers
# Comment out if you prefer to configure via Web UI.
# cupsctl --remote-admin --remote-any --share-printers || true

echo "[entrypoint] Starting cupsd in foreground..."
/usr/sbin/cupsd -f -c /etc/cups/cupsd.conf &
CUPSD_PID=$!
echo "[entrypoint] cupsd pid: $CUPSD_PID"

# Wait briefly for CUPS to be ready
sleep 2
echo "[entrypoint] Available printers:"
lpstat -p || true
lpstat -a || true
lpstat -d || true

echo "[entrypoint] Starting app (uvicorn)..."
# Use poetry virtualenv
poetry run uvicorn app.main:app --host 0.0.0.0 --port 8000 &
APP_PID=$!
echo "[entrypoint] app pid: $APP_PID"

# Forward signals and wait for processes
trap "echo '[entrypoint] stopping...'; kill $CUPSD_PID $APP_PID 2>/dev/null || true; wait; exit 0" SIGINT SIGTERM

# Wait on either process to exit; if one dies, exit so orchestrator restarts the container
wait -n $CUPSD_PID $APP_PID
STATUS=$?
echo "[entrypoint] one process exited with status $STATUS, exiting"
exit $STATUS
