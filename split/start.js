/* Command Center — start.js
   Boot sequence. Wire event delegation. Initial render.
   Foundation Stage v0.1 */

(function() {
  'use strict';

  function boot() {
    // Event delegation (Hard Rule 3)
    document.body.addEventListener('click', CC.handleClick, false);

    // Hash routing
    window.addEventListener('hashchange', CC.onRouteChange, false);

    // Version label
    const vlabel = CC.$('#ccVersionLabel');
    if (vlabel) vlabel.textContent = CC.VERSION;

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
