import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface GstStateRow {
  id: number;
  code: string;          // serial number, e.g. "01" — display/ordering only
  isoCode: string;        // "KA" — matches BusinessLocation.state
  name: string;           // "Karnataka" — matches GSTIN.state
  igstEnabled: boolean;    // stored config toggle, not derived
  cgstSgstEnabled: boolean; // stored config toggle, not derived
  hasSEZ: boolean;
  linkedStores: number;
  activeGstins: number;
  updatedAt: Date;
  createdBy: string; // user name, for the "CREATED BY" column
}

export interface GstStateStats {
  totalStates: number;
  activeGstins: number;
  igstEnabled: number;
  statesWithSEZ: number;
}

// ── Table rows ──────────────────────────────────────────────
export async function getGstStateTable(): Promise<GstStateRow[]> {
  const states = await prisma.gstState.findMany({
    orderBy: { code: "asc" },
    include: { createdBy: { select: { name: true } } },
  });

  const rows = await Promise.all(
    states.map(async (state) => {
      const [linkedStores, activeGstins, sezGstinCount] = await Promise.all([
        prisma.businessLocation.count({
          where: { state: state.isoCode },
        }),
        prisma.gSTIN.count({
          where: { state: state.name, status: "VERIFIED" },
        }),
        prisma.gSTIN.count({
          where: { state: state.name, registrationType: "SEZ" }, // fixed
        }),
      ]);

      return {
        id: state.id,
        code: state.code,
        isoCode: state.isoCode,
        name: state.name,
        igstEnabled: state.igstEnabled,
        cgstSgstEnabled: state.cgstSgstEnabled,
        hasSEZ: sezGstinCount > 0,
        linkedStores,
        activeGstins,
        updatedAt: state.updatedAt,
        createdBy: state.createdBy.name,
      };
    })
  );

  return rows;
}

// ── Top stat cards ──────────────────────────────────────────
export async function getGstStateStats(): Promise<GstStateStats> {
  const [totalStates, activeGstins, igstEnabled] = await Promise.all([
    prisma.gstState.count(),
    prisma.gSTIN.count({ where: { status: "VERIFIED" } }),
    prisma.gstState.count({ where: { igstEnabled: true } }),
  ]);

  const statesWithSEZGstins = await prisma.gSTIN.groupBy({
    by: ['state'],
    where: { registrationType: 'SEZ' },
  });

  return {
    totalStates,
    activeGstins,
    igstEnabled,
    statesWithSEZ: statesWithSEZGstins.length,
  };
}

// ── Lightweight options for dropdowns ─────────────────────────
export async function getGstStateOptions() {
  return prisma.gstState.findMany({
    select: { id: true, code: true, isoCode: true, name: true },
    orderBy: { code: "asc" },
  });
}

// ── Single state (edit view) ──────────────────────────────────
export async function getGstStateById(id: number): Promise<GstStateRow | null> {
  const state = await prisma.gstState.findUnique({
    where: { id },
    include: { createdBy: { select: { name: true } } },
  });

  if (!state) return null;

  const [linkedStores, activeGstins, sezGstinCount] = await Promise.all([
    prisma.businessLocation.count({
      where: { state: state.isoCode },
    }),
    prisma.gSTIN.count({
      where: { state: state.name, status: "VERIFIED" },
    }),
    prisma.gSTIN.count({
      where: { state: state.name, registrationType: "SEZ" },
    }),
  ]);

  return {
    id: state.id,
    code: state.code,
    isoCode: state.isoCode,
    name: state.name,
    igstEnabled: state.igstEnabled,
    cgstSgstEnabled: state.cgstSgstEnabled,
    hasSEZ: sezGstinCount > 0,
    linkedStores,
    activeGstins,
    updatedAt: state.updatedAt,
    createdBy: state.createdBy.name,
  };
}

export async function getLinkedStoresByState(stateId: number) {
  const state = await prisma.gstState.findUnique({ where: { id: stateId } });
  if (!state) return [];

  const locations = await prisma.businessLocation.findMany({
    where: { state: state.isoCode },
    include: { parentOrganizationUnit: { select: { organizationUnit: true } } },
    orderBy: { locationName: "asc" },
  });

  return locations.map((loc) => ({
    id: loc.id,
    label: `${loc.parentOrganizationUnit.organizationUnit} - ${loc.locationName}`,
  }));
}
// ── Update a single state's config (edit view) ────────────────
export interface UpdateGstStateInput {
  igstEnabled?: boolean;
  cgstSgstEnabled?: boolean;
  updatedById: number;
}

export async function updateGstState(id: number, input: UpdateGstStateInput) {
  return prisma.gstState.update({
    where: { id },
    data: {
      igstEnabled: input.igstEnabled,
      cgstSgstEnabled: input.cgstSgstEnabled,
      updatedById: input.updatedById,
    },
  });
}