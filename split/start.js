/* Command Center — start.js
   Boot sequence. Wire event delegation. Initial render.
   Foundation Stage v0.1 */

(function() {
  'use strict';

  function boot() {
    // Operational log capture — the Scriptorium records these. Registered
    // before anything else so boot-time errors are also caught.
    if (CC.log) {
      window.addEventListener('error', function(ev) {
        CC.log('error', ev.message || 'Uncaught error', {
          source: ev.filename,
          line: ev.lineno,
          col: ev.colno,
          stack: ev.error && ev.error.stack,
        });
      });
      window.addEventListener('unhandledrejection', function(ev) {
        var reason = ev.reason;
        var msg = 'Unhandled promise rejection';
        var ctx = {};
        if (reason instanceof Error) {
          msg += ': ' + (reason.message || reason.name || '');
          ctx.stack = reason.stack;
          ctx.name = reason.name;
        } else if (reason != null) {
          try { msg += ': ' + String(reason); } catch (e) {}
        }
        CC.log('error', msg, ctx);
      });
      CC.log('info', 'Capital booted', { version: CC.VERSION, built: CC.BUILT });
    }

    // Event delegation (Hard Rule 3)
    document.body.addEventListener('click', CC.handleClick, false);

    // Hash routing
    window.addEventListener('hashchange', CC.onRouteChange, false);

    // Version label
    const vlabel = CC.$('#ccVersionLabel');
    if (vlabel) vlabel.textContent = CC.VERSION;

    // Built-date label (civic signature footer)
    const bLabel = CC.$('#ccBuiltLabel');
    if (bLabel && CC.BUILT) {
      bLabel.textContent = 'built ' + (CC.formatDateShort ? CC.formatDateShort(CC.BUILT) : CC.BUILT);
    }

    // Backdrop closes overlay
    const backdrop = CC.$('#overlayBackdrop');
    if (backdrop) backdrop.addEventListener('click', CC.closeOverlay, false);

    // Kick off Codex fetch (non-blocking)
    if (CC.ostia && CC.ostia.warmStart) {
      CC.ostia.warmStart();
    }

    // Initial route
    CC.onRouteChange();

    // If we're on the Archives, hook the canons panel
    setTimeout(function() {
      const canonsPanel = CC.$('#archivesCanonsBody');
      if (canonsPanel) {
        CC.ostia.renderCanonsInto(canonsPanel);
      }
    }, 0);
  }

  // Re-hook archives panel after navigation (since rendering replaces the DOM)
  const origRender = CC.renderRoom;
  CC.renderRoom = function(room) {
    origRender(room);
    if (room && room.id === 'archives') {
      const canonsPanel = CC.$('#archivesCanonsBody');
      if (canonsPanel) {
        CC.ostia.renderCanonsInto(canonsPanel);
      }
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, false);
  } else {
    boot();
  }
})();
