import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getPriceBook, updatePriceBookRate } from './api';

export function PriceBookEditor() {
  const queryClient = useQueryClient();
  const { data: priceBook } = useQuery({ queryKey: ['priceBook'], queryFn: getPriceBook });

  const mutation = useMutation({
    mutationFn: ({ id, rate }: { id: string; rate: number }) => updatePriceBookRate(id, rate),
    onSuccess: (updated) => {
      queryClient.setQueryData(['priceBook'], updated);
      queryClient.invalidateQueries({ queryKey: ['summary'] });
    },
  });

  if (!priceBook) return <p>Loading price book...</p>;

  return (
    <div>
      <h2>Price Book</h2>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Line Item</th>
            <th>Rate</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {priceBook.map((item) => (
            <tr key={item.id}>
              <td>{item.product}</td>
              <td>{item.label}</td>
              <td>
                <input
                  type="number"
                  step="any"
                  defaultValue={item.rate}
                  onBlur={(e) => {
                    const rate = Number(e.target.value);
                    if (!Number.isNaN(rate) && rate !== item.rate) {
                      mutation.mutate({ id: item.id, rate });
                    }
                  }}
                />
              </td>
              <td>{item.quantity.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
