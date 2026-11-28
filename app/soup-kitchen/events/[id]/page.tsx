import Link from "next/link";
import { cookies } from "next/headers";
import { getGatewayUrl, ACCESS_TOKEN_COOKIE } from "@lib/config";

interface EventDetail {
  id: number;
  name: string;
  description: string;
  eventDate: string;
  location: string;
  status: number;
  statusName: string;
  maxGuests: number;
  totalGuests: number;
  totalMeals: number;
  totalVolunteers: number;
}

async function getEvent(id: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  try {
    const res = await fetch(`${getGatewayUrl()}/api/soup-kitchen/events/${id}`, {
      cache: "no-store",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getEvent(id) as EventDetail | null;

  if (!event) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-2xl font-bold text-forest-50">Event Not Found</h1>
        <Link href="/soup-kitchen/events" className="mt-4 inline-block text-sm font-medium text-forest-300 underline">
          &larr; Back to Events
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link href="/soup-kitchen/events" className="mb-6 inline-block text-sm font-medium text-forest-200 hover:text-forest-50">
        &larr; Back to Events
      </Link>

      <div className="rounded-lg border border-forest-700 bg-forest-900 p-6 shadow-sm shadow-black/20">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-forest-50">{event.name}</h1>
            <p className="mt-1 text-forest-200">{event.location}</p>
          </div>
          <div className="flex gap-2">
            <Link href={`/soup-kitchen/events/${event.id}/edit`} className="rounded-lg border border-forest-600 px-3 py-1.5 text-sm font-medium text-forest-200 hover:bg-forest-800">
              Edit
            </Link>
          </div>
        </div>

        <p className="mb-6 text-forest-100">{event.description}</p>

        <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-forest-400">Date</span>
            <p className="font-medium text-forest-100">{event.eventDate ? new Date(event.eventDate).toLocaleString() : "—"}</p>
          </div>
          <div>
            <span className="text-forest-400">Status</span>
            <p className="font-medium text-forest-100">{event.statusName}</p>
          </div>
          <div>
            <span className="text-forest-400">Guests</span>
            <p className="font-medium text-forest-100">{event.totalGuests} / {event.maxGuests || "∞"}</p>
          </div>
          <div>
            <span className="text-forest-400">Meals Planned</span>
            <p className="font-medium text-forest-100">{event.totalMeals}</p>
          </div>
          <div>
            <span className="text-forest-400">Volunteers</span>
            <p className="font-medium text-forest-100">{event.totalVolunteers}</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Link href={`/soup-kitchen/meals?eventId=${event.id}`} className="rounded-lg border border-forest-700 p-4 text-center hover:shadow-sm">
            <p className="text-lg font-bold text-forest-50">{event.totalMeals}</p>
            <p className="text-sm text-forest-200">Meals</p>
          </Link>
          <Link href={`/soup-kitchen/volunteers?eventId=${event.id}`} className="rounded-lg border border-forest-700 p-4 text-center hover:shadow-sm">
            <p className="text-lg font-bold text-forest-50">{event.totalVolunteers}</p>
            <p className="text-sm text-forest-200">Volunteers</p>
          </Link>
          <Link href={`/soup-kitchen/guests?eventId=${event.id}`} className="rounded-lg border border-forest-700 p-4 text-center hover:shadow-sm">
            <p className="text-lg font-bold text-forest-50">{event.totalGuests}</p>
            <p className="text-sm text-forest-200">Guests</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
