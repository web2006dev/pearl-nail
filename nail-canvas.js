/* Pearl Nails - Nail Canvas Interactive Controller */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const D = window.NailDesign;
    const $ = id => document.getElementById(id);
    if (!D || !$('canvasWorkspace')) return;

    const storageKey = 'pearl_nails_custom_design_v1';
    let design = D.fromLook();
    let selected = 3; // Ring finger selected by default
    let selectedDetail = 0;
    let artColor = 'Pearl';
    let undo = [];
    let redo = [];
    let storageAvailable = true;

    // Load from storage or default
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = D.validate(JSON.parse(stored));
        if (parsed) design = parsed;
      }
    } catch (e) {
      storageAvailable = false;
    }

    function save() {
      try {
        localStorage.setItem(storageKey, JSON.stringify(design));
        storageAvailable = true;
      } catch (e) {
        storageAvailable = false;
      }
      const saveState = $('saveState');
      if (saveState) {
        saveState.textContent = storageAvailable ? 'Saved on this device' : 'Active in session';
      }
    }

    function remember(before) {
      if (JSON.stringify(before) === JSON.stringify(design)) return;
      undo.push(before);
      if (undo.length > 30) undo.shift();
      redo = [];
      save();
    }

    function change(action, message) {
      const before = D.clone(design);
      action();
      remember(before);
      render();
      if (message && $('canvasStatus')) {
        $('canvasStatus').textContent = message;
      }
    }

    function renderPreview() {
      const hand = $('handPreview');
      if (hand) {
        hand.innerHTML = D.handSVG(design, selected, 'canvas');
        // Attach click listeners to fingers
        hand.querySelectorAll('.nc-finger-wrap').forEach(el => {
          el.addEventListener('click', () => {
            selected = parseInt(el.dataset.index, 10);
            render();
          });
        });
      }

      // Large single-nail spotlight preview
      const spotlight = $('singleNailSpotlight');
      if (spotlight) {
        spotlight.innerHTML = D.nailSVG(design.nails[selected], selected, 130);
      }
    }

    function syncSummary() {
      const nail = design.nails[selected];
      const designId = $('designId');
      if (designId) designId.textContent = D.id(design);

      const selectedNailLabel = $('selectedNail');
      if (selectedNailLabel) selectedNailLabel.textContent = `${D.names[selected]} Nail`;

      const designSummary = $('designSummary');
      if (designSummary) {
        const artCount = nail.art.length;
        designSummary.innerHTML = `<strong>${D.names[selected]}:</strong> ${nail.length} ${nail.shape} · ${nail.color} (${nail.finish})${artCount ? ` with ${artCount} ${nail.art[0].type} accent` : ''}`;
      }

      const undoBtn = $('undoDesign');
      const redoBtn = $('redoDesign');
      if (undoBtn) undoBtn.disabled = undo.length === 0;
      if (redoBtn) redoBtn.disabled = redo.length === 0;

      // Update WhatsApp booking link with design info
      const bookBtn = $('bookDesign');
      if (bookBtn) {
        const text = encodeURIComponent(`Hello Pearl Nails! I customized a nail set on your website:\n• Finger: ${D.names[selected]}\n• Shape: ${nail.shape}\n• Length: ${nail.length}\n• Shade: ${nail.color}\n• Finish: ${nail.finish}\n• Art: ${nail.art.map(a => a.type).join(', ') || 'Clean Minimal'}\n\nI would love to book an appointment at your 3B2 Mohali studio.`);
        bookBtn.href = `https://wa.me/919915522210?text=${text}`;
      }
    }

    function renderControls() {
      const nail = design.nails[selected];

      // Finger selector buttons
      const fingerButtons = $('fingerButtons');
      if (fingerButtons) {
        fingerButtons.innerHTML = D.names.map((name, i) => `
          <button type="button" class="nc-finger-btn ${i === selected ? 'active' : ''}" data-idx="${i}">
            ${name}
          </button>
        `).join('');
        fingerButtons.querySelectorAll('button').forEach(btn => {
          btn.addEventListener('click', () => {
            selected = parseInt(btn.dataset.idx, 10);
            render();
          });
        });
      }

      // Shapes
      const shapeOptions = $('shapeOptions');
      if (shapeOptions) {
        shapeOptions.innerHTML = D.shapes.map(s => `
          <button type="button" class="nc-opt-btn ${s === nail.shape ? 'active' : ''}" data-val="${s}">
            ${s}
          </button>
        `).join('');
        shapeOptions.querySelectorAll('button').forEach(btn => {
          btn.addEventListener('click', () => {
            const val = btn.dataset.val;
            change(() => {
              if ($('editAll')?.checked) {
                design.nails.forEach(n => n.shape = val);
              } else {
                design.nails[selected].shape = val;
              }
            }, `Applied ${val} shape`);
          });
        });
      }

      // Lengths
      const lengthOptions = $('lengthOptions');
      if (lengthOptions) {
        lengthOptions.innerHTML = D.lengths.map(l => `
          <button type="button" class="nc-opt-btn ${l === nail.length ? 'active' : ''}" data-val="${l}">
            ${l}
          </button>
        `).join('');
        lengthOptions.querySelectorAll('button').forEach(btn => {
          btn.addEventListener('click', () => {
            const val = btn.dataset.val;
            change(() => {
              if ($('editAll')?.checked) {
                design.nails.forEach(n => n.length = val);
              } else {
                design.nails[selected].length = val;
              }
            }, `Length set to ${val}`);
          });
        });
      }

      // Colors
      const colorOptions = $('colorOptions');
      const colorName = $('colorName');
      if (colorName) colorName.textContent = `— ${nail.color}`;
      if (colorOptions) {
        colorOptions.innerHTML = Object.entries(D.colors).map(([name, hex]) => `
          <button type="button" class="nc-swatch ${name === nail.color ? 'active' : ''}" data-val="${name}" title="${name}" style="background-color:${hex}">
            <span class="sr-only">${name}</span>
          </button>
        `).join('');
        colorOptions.querySelectorAll('button').forEach(btn => {
          btn.addEventListener('click', () => {
            const val = btn.dataset.val;
            change(() => {
              if ($('editAll')?.checked) {
                design.nails.forEach(n => n.color = val);
              } else {
                design.nails[selected].color = val;
              }
            }, `Selected ${val}`);
          });
        });
      }

      // Finishes
      const finishOptions = $('finishOptions');
      if (finishOptions) {
        finishOptions.innerHTML = D.finishes.map(f => `
          <button type="button" class="nc-opt-btn ${f === nail.finish ? 'active' : ''}" data-val="${f}">
            ${f}
          </button>
        `).join('');
        finishOptions.querySelectorAll('button').forEach(btn => {
          btn.addEventListener('click', () => {
            const val = btn.dataset.val;
            change(() => {
              if ($('editAll')?.checked) {
                design.nails.forEach(n => n.finish = val);
              } else {
                design.nails[selected].finish = val;
              }
            }, `Finish set to ${val}`);
          });
        });
      }

      // Art options
      const artOptions = $('artOptions');
      if (artOptions) {
        artOptions.innerHTML = D.arts.map(a => `
          <button type="button" class="nc-opt-btn nc-art-btn" data-val="${a}">
            + ${a}
          </button>
        `).join('');
        artOptions.querySelectorAll('button').forEach(btn => {
          btn.addEventListener('click', () => {
            const val = btn.dataset.val;
            change(() => {
              const currentArt = design.nails[selected].art;
              if (currentArt.length >= 3) currentArt.shift();
              currentArt.push({
                type: val,
                color: artColor,
                x: 50,
                y: 75,
                size: 1,
                rotation: 0
              });
              selectedDetail = currentArt.length - 1;
            }, `Added ${val} detail`);
          });
        });
      }

      // Art detail colors
      const artColorOptions = $('artColorOptions');
      if (artColorOptions) {
        artColorOptions.innerHTML = Object.entries(D.artColors).map(([name, hex]) => `
          <button type="button" class="nc-opt-btn ${name === artColor ? 'active' : ''}" data-val="${name}">
            <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${hex};margin-right:4px;"></span>${name}
          </button>
        `).join('');
        artColorOptions.querySelectorAll('button').forEach(btn => {
          btn.addEventListener('click', () => {
            artColor = btn.dataset.val;
            const currentArt = design.nails[selected].art;
            if (currentArt[selectedDetail]) {
              change(() => {
                currentArt[selectedDetail].color = artColor;
              }, `Detail colour: ${artColor}`);
            } else {
              renderControls();
            }
          });
        });
      }

      // Details list
      const detailEditor = $('detailEditor');
      const detailList = $('detailList');
      if (detailEditor && detailList) {
        const art = nail.art;
        if (art.length > 0) {
          detailEditor.hidden = false;
          detailList.innerHTML = art.map((item, idx) => `
            <button type="button" class="nc-opt-btn ${idx === selectedDetail ? 'active' : ''}" data-idx="${idx}">
              ${item.type} (${item.color})
            </button>
          `).join('');
          detailList.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', () => {
              selectedDetail = parseInt(btn.dataset.idx, 10);
              renderControls();
            });
          });

          // Sliders
          const currentItem = art[selectedDetail] || art[0];
          if (currentItem) {
            $('artX').value = currentItem.x;
            $('artY').value = currentItem.y;
            $('artSize').value = Math.round(currentItem.size * 100);
            $('artRotation').value = currentItem.rotation;
          }
        } else {
          detailEditor.hidden = true;
        }
      }
    }

    function render() {
      renderPreview();
      syncSummary();
      renderControls();
    }

    // Attach Sliders
    ['artX', 'artY', 'artSize', 'artRotation'].forEach(sliderId => {
      const slider = $(sliderId);
      if (slider) {
        slider.addEventListener('input', () => {
          const art = design.nails[selected].art;
          if (!art[selectedDetail]) return;
          if (sliderId === 'artX') art[selectedDetail].x = Number(slider.value);
          if (sliderId === 'artY') art[selectedDetail].y = Number(slider.value);
          if (sliderId === 'artSize') art[selectedDetail].size = Number(slider.value) / 100;
          if (sliderId === 'artRotation') art[selectedDetail].rotation = Number(slider.value);
          renderPreview();
        });
        slider.addEventListener('change', () => {
          save();
        });
      }
    });

    // Remove detail
    $('removeDetail')?.addEventListener('click', () => {
      const art = design.nails[selected].art;
      if (art.length > 0) {
        change(() => {
          art.splice(selectedDetail, 1);
          selectedDetail = Math.max(0, art.length - 1);
        }, 'Removed detail');
      }
    });

    // Copy to all
    $('copyNail')?.addEventListener('click', () => {
      const target = design.nails[selected];
      change(() => {
        design.nails = design.nails.map(() => D.clone(target));
      }, `Copied ${D.names[selected]} design across all fingers`);
    });

    // Reset
    $('resetDesign')?.addEventListener('click', () => {
      change(() => {
        design = D.fromLook();
      }, 'Design reset to default');
    });

    // Undo / Redo
    $('undoDesign')?.addEventListener('click', () => {
      if (!undo.length) return;
      const prev = undo.pop();
      redo.push(D.clone(design));
      design = prev;
      save();
      render();
    });

    $('redoDesign')?.addEventListener('click', () => {
      if (!redo.length) return;
      const next = redo.pop();
      undo.push(D.clone(design));
      design = next;
      save();
      render();
    });

    // Skin Tone
    $('skinTone')?.addEventListener('change', e => {
      design.skin = e.target.value;
      save();
      renderPreview();
    });

    // Initialize workspace
    const workspace = $('canvasWorkspace');
    if (workspace) workspace.hidden = false;
    const fallback = $('canvasFallback');
    if (fallback) fallback.hidden = true;

    // Initial render
    render();

    // Listen for preset look events (from Mood Board)
    window.addEventListener('pearlApplyLook', (e) => {
      const look = e.detail;
      if (look) {
        change(() => {
          design = D.fromLook(look);
        }, `Applied ${look.name} look`);
        // Smooth scroll to canvas
        document.getElementById('nail-canvas')?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
})();
