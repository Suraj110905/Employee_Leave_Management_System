# Coding Standards & Guidelines

This document details style parameters, validation policies, and comment requirements enforced throughout the project repository.

---

## 🎨 JavaScript & React Guidelines

* **Pure Components**: UI presentation components must be stateless, receiving inputs exclusively via props parameters.
* **Immutable State Updates**: Never mutate arrays or object states directly. Use spread structures (e.g. `[...items]`) to guarantee correct virtual DOM comparisons:
  ```javascript
  // Correct
  setLeaves((prev) => prev.map((l) => l.id === id ? { ...l, status: "Approved" } : l));
  
  // Incorrect
  leaves.find(l => l.id === id).status = "Approved";
  ```
* **No Direct DOM Queries**: Use React standard refs or hooks for canvas operations. Never query `document.getElementById` or selectors.

---

## 🏷️ JSDoc Documentation Rules

All exported functions, react components, hook functions, and service properties must contain structured JSDoc descriptions.

### JSDoc Examples

#### 1. React Presentational Component
```javascript
/**
 * Reusable Metric Statistic Card.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {string} props.title - Card header indicator label.
 * @param {string|number} props.value - Numerical or text metric count.
 * @param {React.ComponentType} props.icon - Lucide react icon template.
 */
export default function StatCard({ title, value, icon: Icon }) { ... }
```

#### 2. Async Database Service Method
```javascript
/**
 * Approves a pending leave request, handling multi-level validation stages.
 *
 * @param {string} leaveId - Request ID.
 * @param {string} managerId - Reviewer Manager ID.
 * @param {string} remarks - Approval comments remarks.
 * @returns {Promise<Object>} Updated request details.
 */
export const approveRequest = async (leaveId, managerId, remarks) => { ... }
```

---

## 💅 Styling and Layout Standards

* **Tailwind Variables**: Avoid absolute hex values (e.g., `text-[#3b82f6]`). Always map colors to the CSS custom variables system:
  * **Correct**: `text-primary`, `bg-card`, `border-border`
  * **Incorrect**: `text-green-600`, `bg-white` (use custom theme colors where applicable to support future dark mode settings)
* **Mobile-First Layouts**: Design grid setups to stack by default and use media query parameters (`md:`, `lg:`) to structure multi-column desktop grids.
